import { randomInt, randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { redis } from "../config/redis";
import { producer } from "../kafka/producer";
import prismaClient from "../prisma/index";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import { RegisterInputInterface, RegisterOutputInterface } from "../types/register.types";
import { PendingRegistration } from "../types/email-verification.types";

const PENDING_KEY = (email: string) => `pending:reg:${email}`;

export class EmailVerificationService {
    async initiate(input: RegisterInputInterface): Promise<void> {
        const passwordHash = await hash(input.password, 10);
        const code = String(randomInt(100_000, 999_999));

        const pending: PendingRegistration = {
            username: input.username,
            name: input.name,
            email: input.email,
            passwordHash,
            bornAt: input.bornAt instanceof Date ? input.bornAt.toISOString() : String(input.bornAt),
            code,
        };

        await redis.set(PENDING_KEY(input.email), JSON.stringify(pending), env.emailVerificationTtlSeconds);

        await producer.send({
            topic: "auth.email.verification",
            messages: [{ value: JSON.stringify({ email: input.email, name: input.name, code }) }],
        });
    }

    async verify(email: string, code: string): Promise<RegisterOutputInterface> {
        const raw = await redis.get(PENDING_KEY(email));

        if (!raw) {
            throw new AppError("Nenhuma verificação pendente para este email ou código expirado", 404);
        }

        const pending: PendingRegistration = JSON.parse(raw);

        if (pending.code !== code) {
            throw new AppError("Código de verificação inválido", 422);
        }

        await redis.del(PENDING_KEY(email));

        let account: Awaited<ReturnType<typeof prismaClient.access.create>>;

        try {
            account = await prismaClient.access.create({
                data: {
                    accountId: randomUUID(),
                    username: pending.username,
                    email: pending.email,
                    passwordHash: pending.passwordHash,
                },
            });
        } catch (err: any) {
            if (err?.code === "P2002") {
                throw new AppError("Email ou username já está em uso", 409);
            }
            throw err;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), env.fetchTimeoutMs);

        try {
            const profileResponse = await fetch(`${env.profileServiceUrl}/users/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId: account.accountId, name: pending.name, username: pending.username }),
                signal: controller.signal,
            });

            if (!profileResponse.ok) {
                throw new AppError("Serviço de perfil indisponível", 502);
            }

            const profile = await profileResponse.json() as { accountId: string };

            return {
                authId: account.id,
                accountId: profile.accountId,
                username: account.username,
                name: pending.name,
                email: account.email,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
                bornAt: new Date(pending.bornAt),
            };
        } catch (err) {
            await prismaClient.access.delete({ where: { id: account.id } });
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }
}

import prismaClient from "../prisma/index";
import { RegisterInputInterface, RegisterOutputInterface } from "../types/register.types";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

export class RegisterService {
    async register(input: RegisterInputInterface): Promise<RegisterOutputInterface> {
        const passwordHash = await hash(input.password, 10);

        let account: Awaited<ReturnType<typeof prismaClient.access.create>>;

        try {
            account = await prismaClient.access.create({
                data: {
                    accountId: randomUUID(),
                    username: input.username,
                    email: input.email,
                    passwordHash,
                },
            });
        } catch (err: any) {
            if (err?.code === 'P2002') {
                throw new AppError('Email ou username já está em uso', 409);
            }
            throw err;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), env.fetchTimeoutMs);

        try {
            const profileResponse = await fetch(`${env.profileServiceUrl}/users/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId: account.accountId, name: input.name, username: input.username }),
                signal: controller.signal,
            });

            if (!profileResponse.ok) {
                throw new AppError('Serviço de perfil indisponível', 502);
            }

            const profile = await profileResponse.json() as { accountId: string };

            return {
                authId: account.id,
                accountId: profile.accountId,
                username: account.username,
                name: input.name,
                email: account.email,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
                bornAt: input.bornAt,
            };
        } catch (err) {
            await prismaClient.access.delete({ where: { id: account.id } });
            throw err;
        } finally {
            clearTimeout(timer);
        }
    }
}

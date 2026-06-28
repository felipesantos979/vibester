import prismaClient from "../prisma/index";
import { RegisterInputInterface, RegisterOutputInterface } from "../types/register.types";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";

export class RegisterService {
    async register(input: RegisterInputInterface): Promise<RegisterOutputInterface> {
        console.log("Criando cadastro de usuário");

        const passwordHash = await hash(input.password, 10);

        const account = await prismaClient.access.create({
            data: {
                accountId: randomUUID(),
                username: input.username,
                email: input.email,
                passwordHash,
            }
        });

        const profileResponse = await fetch(`${env.profileServiceUrl}/users/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId: account.accountId }),
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to create user profile');
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
    }
}

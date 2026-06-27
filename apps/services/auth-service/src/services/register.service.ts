import prismaClient from "../prisma/index";
import { RegisterInputInterface, RegisterOutputInterface } from "../types/register.types";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
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

        try {
            await fetch(`${env.profileServiceUrl}/api/users/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: account.accountId }),
            });
        } catch (err) {
            console.error('Failed to create profile in user-service', err);
        }

        const token = jwt.sign(
            { userId: account.id },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
        );

        return {
            id: account.id,
            token,
            username: account.username,
            name: input.name,
            email: account.email,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            bornAt: input.bornAt,
        };
    }
}

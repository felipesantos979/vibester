import prismaClient from "../prisma/index";
import { RegisterInputInterface, RegisterOutputInterface } from "../types/register.types";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { producer } from "../kafka/producer";

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

        await producer.send({
            topic: 'user.registered',
            messages: [{
                key: account.accountId,
                value: JSON.stringify({
                    accountId: account.accountId,
                    email: account.email,
                    username: account.username,
                    name: input.name,
                }),
            }],
        });

        return {
            id: account.id,
            username: account.username,
            name: input.name,
            email: account.email,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
            bornAt: input.bornAt,
        };
    }
}

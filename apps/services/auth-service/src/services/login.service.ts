import prismaClient from "../prisma";
import { LoginInputInterface, LoginOutputInterface } from "../types/register.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

export class LoginService {
    async login(input: LoginInputInterface): Promise<LoginOutputInterface> {
        const user = await prismaClient.access.findFirst({
            where: {
                OR: [
                    ...(input.email ? [{ email: input.email }] : []),
                    ...(input.username ? [{ username: input.username }] : []),
                ],
            },
        });

        if (!user) {
            throw new AppError("Usuário ou senha inválidos", 401);
        }

        const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);

        if (!passwordMatch) {
            throw new AppError("Usuário ou senha inválidos", 401);
        }

        const token = jwt.sign(
            { userId: user.id, accountId: user.accountId },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
        );

        return {
            authId: user.id,
            token,
            accountId: user.accountId,
        };
    }
}

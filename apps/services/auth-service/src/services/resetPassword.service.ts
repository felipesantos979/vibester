import bcrypt from "bcryptjs";
import prismaClient from "../prisma";
import { ResetPasswordInput } from "../types/register.types";

export class ResetPasswordService {
    async resetPassword(input: ResetPasswordInput): Promise<void> {
        console.log("Iniciando processo de reset da senha");

        const user = await prismaClient.access.findFirst({
            where: {
                resetPasswordToken: input.token,
                resetPasswordExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            throw new Error("Token inválido ou expirado.");
        }

        const newPasswordHash = await bcrypt.hash(input.password, 10);

        await prismaClient.access.update({
            where: { id: user.id },
            data: {
                passwordHash: newPasswordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        console.log(`Senha atualizada com sucesso para o token fornecido.`);
    }
}

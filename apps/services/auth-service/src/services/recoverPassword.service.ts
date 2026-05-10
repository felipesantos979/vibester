import crypto from "crypto";
import prismaClient from "../prisma";
import { RecoverPasswordInput } from "../types/register.types";

export class RecoverPasswordService {
    async requestRecovery(input: RecoverPasswordInput): Promise<void> {
        console.log(`Solicitando recuperação de senha para: ${input.email}`);

        const user = await prismaClient.access.findUnique({
            where: { email: input.email }
        });

        if (!user) {
            console.log(`Usuário não encontrado para email ${input.email}. Nenhuma ação realizada.`);
            return;
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

        await prismaClient.access.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: tokenExpiration
            },
        });

        console.log(`\n==========================================`);
        console.log(`EMAIL ENVIADO VIRTUALMENTE PARA: ${user.email}`);
        console.log(`Seu Token de Recuperação: ${resetToken}`);
        console.log(`==========================================\n`);
    }
}

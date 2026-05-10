import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { RecoverPasswordInput, ResetPasswordInput } from "../types/register.types";
import { RecoverPasswordService } from "../services/recoverPassword.service";
import { ResetPasswordService } from "../services/resetPassword.service";

export class RecoverPasswordController {
    private readonly recoverPasswordService = new RecoverPasswordService();
    private readonly resetPasswordService = new ResetPasswordService();

    async recoverPassword(
        request: FastifyRequest<{ Body: RecoverPasswordInput }>,
        reply: FastifyReply
    ) {
        const schema = z.object({
            email: z.string().email({ message: "Formato de email inválido" }),
        });
        
        const parseResult = schema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ error: parseResult.error.message });
        }

        await this.recoverPasswordService.requestRecovery(parseResult.data);

        return reply.status(200).send({ message: "Se o email estiver cadastrado, as instruções foram enviadas." });
    }

    async resetPassword(
        request: FastifyRequest<{ Body: ResetPasswordInput }>,
        reply: FastifyReply
    ) {
        const schema = z.object({
            token: z.string().min(1, "O token é obrigatório"),
            password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
        });
        
        const parseResult = schema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ error: parseResult.error.message });
        }

        try {
            await this.resetPasswordService.resetPassword(parseResult.data);
            return reply.status(200).send({ message: "Senha redefinida com sucesso!" });
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}

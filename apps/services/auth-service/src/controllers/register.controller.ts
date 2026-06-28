import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterService } from "../services/register.service";
import { RegisterInputInterface } from "../types/register.types";
import { AppError } from "../errors/app-error";

export class RegisterController {
    private readonly registerService = new RegisterService();

    async register(
        request: FastifyRequest<{ Body: RegisterInputInterface }>,
        reply: FastifyReply
    ) {
        const { name, username, email, password, bornAt } = request.body;

        try {
            const account = await this.registerService.register({
                name,
                username,
                email,
                password,
                bornAt: new Date(bornAt),
            });
            return reply.status(201).send(account);
        } catch (error: any) {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({ error: error.message });
            }
            request.log.error(error);
            return reply.status(500).send({ error: "Erro interno do servidor" });
        }
    }
}

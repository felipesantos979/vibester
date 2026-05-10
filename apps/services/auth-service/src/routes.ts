import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { LoginInputInterface, RegisterInputInterface, RecoverPasswordInput, ResetPasswordInput } from "./types/register.types";
import { RegisterController } from "./controllers/register.controller";
import { LoginController } from "./controllers/login.controller";
import { RecoverPasswordController } from "./controllers/recoverPassword.controller";

export async function authRoutes(instance: FastifyInstance, options: FastifyPluginOptions) {
    
    instance.post("/register", async(
        request: FastifyRequest<{ Body: RegisterInputInterface }>,
        reply: FastifyReply) => {
            return new RegisterController().register(request, reply);
        }
    );

    instance.post("/login", async(
        request: FastifyRequest<{ Body: LoginInputInterface }>,
        reply: FastifyReply) => {
            return new LoginController().login(request, reply);
        }
    );

    instance.post("/recover-password", async(
        request: FastifyRequest<{ Body: RecoverPasswordInput }>,
        reply: FastifyReply) => {
            return new RecoverPasswordController().recoverPassword(request, reply);
        }
    );

    instance.post("/reset-password", async(
        request: FastifyRequest<{ Body: ResetPasswordInput }>,
        reply: FastifyReply) => {
            return new RecoverPasswordController().resetPassword(request, reply);
        }
    );
}
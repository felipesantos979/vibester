import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { LoginInputInterface, RegisterInputInterface } from "./types/register.types";
import { RegisterController } from "./controllers/register.controller";
import { LoginController } from "./controllers/login.controller";

export async function authRoutes(instance: FastifyInstance, options: FastifyPluginOptions) {

    instance.get("/health", {
        schema: {
            tags: ["Health"],
            summary: "Health check",
            description: "Verifica se o serviço está disponível.",
            response: {
                200: {
                    type: "object",
                    properties: { status: { type: "string", example: "ok" } },
                },
            },
        },
    }, async (_request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ status: "ok" });
    });

    instance.post("/register", {
        schema: {
            tags: ["Auth"],
            summary: "Registrar conta",
            description: "Cria uma nova conta de usuário.",
            body: {
                type: "object",
                required: ["username", "name", "email", "password", "bornAt"],
                properties: {
                    username: { type: "string", example: "joaosilva" },
                    name: { type: "string", example: "João Silva" },
                    email: { type: "string", format: "email", example: "joao@email.com" },
                    password: { type: "string", minLength: 6, example: "senha123" },
                    bornAt: { type: "string", format: "date", example: "1998-05-20" },
                },
            },
            response: {
                201: {
                    description: "Conta criada com sucesso",
                    type: "object",
                    properties: {
                        authId: { type: "string", format: "uuid" },
                        accountId: { type: "string", format: "uuid" },
                        username: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        bornAt: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                400: {
                    description: "Erro ao criar conta",
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, async (
        request: FastifyRequest<{ Body: RegisterInputInterface }>,
        reply: FastifyReply) => {
            return new RegisterController().register(request, reply);
        }
    );

    instance.post("/login", {
        schema: {
            tags: ["Auth"],
            summary: "Login",
            description: "Autentica uma conta usando email ou username e retorna um token JWT.",
            body: {
                type: "object",
                required: ["password"],
                properties: {
                    email: { type: "string", format: "email", example: "joao@email.com" },
                    username: { type: "string", example: "joaosilva" },
                    password: { type: "string", minLength: 6, example: "senha123" },
                },
            },
            response: {
                200: {
                    description: "Autenticado com sucesso",
                    type: "object",
                    properties: {
                        authId: { type: "string", format: "uuid" },
                        token: { type: "string" },
                        accountId: { type: "string", format: "uuid" },
                    },
                },
                400: {
                    description: "Dados inválidos",
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, async (
        request: FastifyRequest<{ Body: LoginInputInterface }>,
        reply: FastifyReply) => {
            return new LoginController().login(request, reply);
        }
    );
}

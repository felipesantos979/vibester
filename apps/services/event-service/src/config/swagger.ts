import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "@fastify/type-provider-zod";

export async function registerSwagger(app: FastifyInstance) {
    if (process.env.SWAGGER_ENABLED !== "true") return;

    await app.register(swagger, {
        openapi: {
            info: {
                title: "Event Service API",
                description:
                    "Documentação da API do serviço de eventos do Vibester (criação, listagem por proximidade e detalhes).",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            tags: [
                { name: "Health", description: "Verificação de saúde do serviço" },
                { name: "Events", description: "Eventos" },
            ],
        },
        transform: jsonSchemaTransform,
    });

    await app.register(swaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
        },
    });
}

import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { env } from "./env";

export async function registerSwagger(app: FastifyInstance) {
  if (!env.SWAGGER_ENABLED) return;

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Establishment Service API",
        description:
          "Documentação da API do serviço de estabelecimentos do Vibester (listagem, filtros, perfil e avaliações).",
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
        { name: "Establishments", description: "Estabelecimentos" },
        { name: "Metrics", description: "Métricas Prometheus" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}

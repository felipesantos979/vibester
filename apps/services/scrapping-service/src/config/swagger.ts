import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Scrapping Service API",
        description:
          "Documentação da API do serviço de scrapping do Vibester (popularidade, movimento e lugares próximos via Google Places / SerpAPI).",
        version: "1.0.0",
      },
      tags: [
        { name: "Health", description: "Verificação de saúde do serviço" },
        { name: "Places", description: "Lugares e popularidade" },
        { name: "Movements", description: "Nível de movimento de estabelecimentos" },
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

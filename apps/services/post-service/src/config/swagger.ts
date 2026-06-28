import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Post Service API",
        description:
          "Documentação da API do serviço de posts do Vibester (posts, curtidas e comentários).",
        version: "1.0.0",
      },
      tags: [
        { name: "Health", description: "Verificação de saúde do serviço" },
        { name: "Upload", description: "Geração de URLs pré-assinadas para upload direto ao bucket" },
        { name: "Posts", description: "Publicações" },
        { name: "Likes", description: "Curtidas" },
        { name: "Comments", description: "Comentários" },
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

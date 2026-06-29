import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  listEstablishmentsController,
  updateEstablishmentRatingController,
  getEstablishmentProfileController,
  listOpenEstablishmentsController,
  uploadProfilePictureController
} from "./controllers/establishment.controller";

const movementLevelSchema = {
  type: "object",
  nullable: true,
  properties: {
    level: { type: "string" },
    source: { type: "string" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const establishmentSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    googlePlaceId: { type: "string", nullable: true },
    name: { type: "string" },
    bio: { type: "string", nullable: true },
    endereco: { type: "string", nullable: true },
    photoUrl: { type: "string", nullable: true },
    bannerUrl: { type: "string", nullable: true },
    category: { type: "string" },
    priceIndicator: { type: "string", nullable: true },
    averageRating: { type: "number" },
    qtdAvaliacoes: { type: "number" },
    distribuicao: { type: "array", items: { type: "number" } },
    nivelMovimento: { type: "number" },
    latitude: { type: "number" },
    longitude: { type: "number" },
    openingHours: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          dayOfWeek: { type: "number" },
          openTime: { type: "string" },
          closeTime: { type: "string" },
        },
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const establishmentProfileSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    googlePlaceId: { type: "string", nullable: true },
    name: { type: "string" },
    bio: { type: "string", nullable: true },
    endereco: { type: "string", nullable: true },
    photoUrl: { type: "string", nullable: true },
    bannerUrl: { type: "string", nullable: true },
    category: { type: "string" },
    priceIndicator: { type: "string", nullable: true },
    averageRating: { type: "number" },
    qtdAvaliacoes: { type: "number" },
    distribuicao: { type: "array", items: { type: "number" } },
    nivelMovimento: { type: "number" },
    latitude: { type: "number" },
    longitude: { type: "number" },
    openingHours: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          dayOfWeek: { type: "number" },
          openTime: { type: "string" },
          closeTime: { type: "string" },
        },
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const errorSchema = {
  type: "object",
  properties: { message: { type: "string" } },
};

export async function establishmentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/health", {
    schema: {
      tags: ["Health"],
      summary: "Health check",
      response: {
        200: { type: "object", properties: { status: { type: "string", example: "ok" } } },
      },
    },
  }, async (_request, reply) => reply.status(200).send({ status: "ok" }));

  fastify.get("/establishments", {
    schema: {
      tags: ["Establishments"],
      summary: "Listar estabelecimentos",
      description: "Lista estabelecimentos com filtros opcionais por localização, categoria, avaliação e busca textual.",
      querystring: {
        type: "object",
        properties: {
          latitude: { type: "string", description: "Latitude do usuário (deve ser informada junto com longitude)" },
          longitude: { type: "string", description: "Longitude do usuário (deve ser informada junto com latitude)" },
          category: { type: "string", description: "Filtra por categoria" },
          minRating: { type: "string", description: "Avaliação mínima (0 a 5)" },
          search: { type: "string", description: "Busca textual por nome" },
          sortBy: { type: "string", enum: ["name", "rating", "distance"], description: "Critério de ordenação" },
        },
      },
      response: {
        200: { type: "array", items: establishmentSchema },
        400: errorSchema,
        500: errorSchema,
      },
    },
  }, listEstablishmentsController);

  fastify.get("/establishments/open", {
    schema: {
      tags: ["Establishments"],
      summary: "Listar estabelecimentos abertos",
      description: "Lista os estabelecimentos atualmente abertos com base no horário de funcionamento.",
      response: {
        200: { type: "array", items: establishmentSchema },
        500: errorSchema,
      },
    },
  }, listOpenEstablishmentsController);

  fastify.get("/establishments/:id", {
    schema: {
      tags: ["Establishments"],
      summary: "Obter perfil de estabelecimento",
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      response: {
        200: establishmentProfileSchema,
        400: errorSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, getEstablishmentProfileController);

  fastify.patch("/establishments/:id/rating", {
    schema: {
      tags: ["Establishments"],
      summary: "Atualizar avaliação",
      description: "Atualiza a avaliação média de um estabelecimento (valor entre 0 e 5).",
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["rating"],
        properties: { rating: { type: "number", minimum: 0, maximum: 5, example: 4.5 } },
      },
      response: {
        200: establishmentSchema,
        400: errorSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, updateEstablishmentRatingController);

  fastify.post("/establishments/:id/photo", {
    schema: {
      tags: ["Establishments"],
      summary: "Upload de foto de perfil",
      description: "Recebe uma imagem (multipart/form-data), faz upload para o R2 e salva a URL no banco.",
      consumes: ["multipart/form-data"],
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", format: "uuid" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            photoUrl: { type: "string" },
          },
        },
        400: errorSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, uploadProfilePictureController);
}

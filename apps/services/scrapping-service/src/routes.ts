import { FastifyInstance } from "fastify";
import { getMovementByEstablishmentId, getPlacePopularity } from "./controllers/movement.controller";
import { searchNearbyPlaces } from "./controllers/place.controller";

const errorSchema = {
  type: "object",
  properties: { message: { type: "string" } },
};

const placeSchema = {
  type: "object",
  properties: {
    placeId: { type: "string" },
    name: { type: "string" },
    lat: { type: "number" },
    lng: { type: "number" },
    rating: { type: "number" },
  },
  additionalProperties: true,
};

export async function routes(app: FastifyInstance) {
  app.get("/health", {
    schema: {
      tags: ["Health"],
      summary: "Health check",
      response: { 200: { type: "object", properties: { status: { type: "string", example: "ok" } } } },
    },
  }, async () => {
    return { status: "ok" };
  });

  app.get("/places/:placeId/popularity", {
    schema: {
      tags: ["Places"],
      summary: "Popularidade de um lugar",
      description: "Consulta a popularidade (movimento) de um lugar pelo seu placeId via SerpAPI.",
      params: {
        type: "object",
        required: ["placeId"],
        properties: { placeId: { type: "string", description: "Google Place ID" } },
      },
      response: {
        200: { type: "object", additionalProperties: true },
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, getPlacePopularity);

  app.get("/movements/:establishmentId", {
    schema: {
      tags: ["Movements"],
      summary: "Movimento por estabelecimento",
      description: "Retorna o nível de movimento registrado para um estabelecimento.",
      params: {
        type: "object",
        required: ["establishmentId"],
        properties: { establishmentId: { type: "string", format: "uuid" } },
      },
      response: {
        200: { type: "object", additionalProperties: true },
        404: errorSchema,
      },
    },
  }, getMovementByEstablishmentId);

  app.get("/places/nearby", {
    schema: {
      tags: ["Places"],
      summary: "Buscar lugares próximos",
      description: "Busca lugares próximos a uma coordenada usando a API do Google Places.",
      querystring: {
        type: "object",
        properties: {
          types: {
            type: "array",
            items: { type: "string", enum: ["bar", "night_club", "restaurant", "cafe"] },
            description: "Tipos de lugar (padrão: bar)",
          },
          lat: { type: "number", minimum: -90, maximum: 90, default: -23.4205 },
          lng: { type: "number", minimum: -180, maximum: 180, default: -51.9333 },
          radius: { type: "integer", minimum: 1, maximum: 20000, default: 5000, description: "Raio em metros" },
        },
      },
      response: {
        200: { type: "array", items: placeSchema },
        400: {
          type: "object",
          properties: {
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: { field: { type: "string" }, message: { type: "string" } },
              },
            },
          },
        },
        500: errorSchema,
      },
    },
  }, searchNearbyPlaces);
}

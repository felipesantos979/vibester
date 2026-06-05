import { FastifyReply, FastifyRequest } from "fastify";
import { GooglePlacesService } from "../services/google-places.service";
import { nearbyPlacesQuerySchema } from "../schemas/nearby-places.schema";

const googlePlacesService = new GooglePlacesService();

export async function searchNearbyPlaces(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = nearbyPlacesQuerySchema.safeParse(request.query);

  if (!result.success) {
    return reply.status(400).send({
      message: "Parâmetros inválidos",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { types, lat, lng, radius } = result.data;

  try {
    const places = await googlePlacesService.searchNearbyPlaces(
      types,
      lat,
      lng,
      radius
    );

    return reply.status(200).send(places);
  } catch (error) {
    console.error("[PlaceController] Erro ao buscar lugares próximos:", error);

    return reply.status(500).send({
      message: "Erro interno ao buscar lugares próximos",
    });
  }
}
import { FastifyInstance } from "fastify";
import { getMovementByEstablishmentId, getPlacePopularity } from "./controllers/movement.controller";
import { searchNearbyPlaces } from "./controllers/place.controller";

export async function routes(app: FastifyInstance) {
  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.get("/places/:placeId/popularity", getPlacePopularity);
  app.get("/movements/:establishmentId", getMovementByEstablishmentId)
  app.get("/places/nearby", searchNearbyPlaces);
}
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { 
  listEstablishmentsController, 
  updateEstablishmentRatingController,
  getEstablishmentProfileController
} from "./controllers/establishment.controller";

export async function establishmentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/establishments", listEstablishmentsController);
  fastify.get("/establishments/:id", getEstablishmentProfileController);
  fastify.patch("/establishments/:id/rating", updateEstablishmentRatingController);
}

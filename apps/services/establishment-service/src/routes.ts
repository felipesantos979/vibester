import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { 
  listEstablishmentsController, 
  updateEstablishmentRatingController,
  getEstablishmentProfileController,
  listOpenEstablishmentsController
} from "./controllers/establishment.controller";

export async function establishmentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/health", async (_request, reply) => reply.status(200).send({ status: "ok" }));
  fastify.get("/establishments", listEstablishmentsController);
  fastify.get("/establishments/open", listOpenEstablishmentsController);

  fastify.get("/establishments/:id", getEstablishmentProfileController);
  fastify.patch("/establishments/:id/rating", updateEstablishmentRatingController);
}

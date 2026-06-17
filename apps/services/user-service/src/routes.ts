import { FastifyInstance } from "fastify";
import { profileRoutes } from "./controllers/profile.controller.js";

export async function setupRoutes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => reply.status(200).send({ status: "ok" }));
  app.register(profileRoutes, { prefix: "/api/users" });
}

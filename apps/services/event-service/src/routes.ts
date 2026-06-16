import { FastifyInstance } from "fastify";
import { eventRoutes } from "./controllers/event.controller.js";

export async function setupRoutes(app: FastifyInstance) {
    app.get("/health", async (_request, reply) => reply.status(200).send({ status: "ok" }));
    app.register(eventRoutes, { prefix: "/api/events"});
}

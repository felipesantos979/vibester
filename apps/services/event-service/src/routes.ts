import { FastifyInstance } from "fastify";
import { eventRoutes } from "./controllers/event.controller.js";

export async function setupRoutes(app: FastifyInstance) {
    app.register(eventRoutes, { prefix: "/api/events"})
}

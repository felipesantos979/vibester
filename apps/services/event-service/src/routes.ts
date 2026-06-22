import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { eventRoutes } from "./controllers/event.controller.js";

export async function setupRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/health", {
        schema: {
            tags: ["Health"],
            summary: "Health check",
            response: { 200: z.object({ status: z.string() }) },
        },
    }, async (_request, reply) => reply.status(200).send({ status: "ok" }));

    app.register(eventRoutes, { prefix: "/api/events" });
}

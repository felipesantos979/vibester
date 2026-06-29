import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { eventRoutes } from "./controllers/event.controller.js";
import prismaClient from "./prisma";
import { redis } from "./config/redis";

export async function setupRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/health", {
        schema: {
            tags: ["Health"],
            summary: "Health check",
            response: {
                200: z.object({ status: z.string(), db: z.string(), redis: z.string() }),
                503: z.object({ status: z.string(), db: z.string(), redis: z.string() }),
            },
        },
    }, async (_request, reply) => {
        let dbStatus = "ok";
        let redisStatus = "ok";

        try {
            await prismaClient.$queryRaw`SELECT 1`;
        } catch {
            dbStatus = "unavailable";
        }

        try {
            await redis.ping();
        } catch {
            redisStatus = "unavailable";
        }

        const healthy = dbStatus === "ok";
        return reply.status(healthy ? 200 : 503).send({
            status: healthy ? "ok" : "degraded",
            db: dbStatus,
            redis: redisStatus,
        });
    });

    app.register(eventRoutes, { prefix: "/events" });
}

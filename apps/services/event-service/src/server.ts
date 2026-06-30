import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";

import { env } from "./config/env";
import { setupRoutes } from "./routes";
import { registerSwagger } from "./config/swagger";

const app = Fastify({
    logger: true,
    bodyLimit: 1_048_576,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const start = async () => {
    await app.register(cors, {
        origin: env.allowedOrigins,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    });

    await app.register(jwt, { secret: env.jwtSecret });

    await registerSwagger(app);
    await setupRoutes(app);

    try {
        await app.listen({ port: 3334, host: "0.0.0.0" });
        app.log.info(
            { port: 3334, env: process.env.NODE_ENV ?? "production" },
            "event-service started",
        );
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();

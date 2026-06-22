import Fastify from "fastify";
import { env } from "./config/env";
import { routes } from "./routes";
import { registerSwagger } from "./config/swagger";
import { startMovementJob } from "./jobs/movement.job";

const app = Fastify({
  logger: true,
  ajv: { customOptions: { keywords: ["example"] } },
});

const start = async () => {
  await registerSwagger(app);
  await app.register(routes);
  await app.listen({ port: Number(env.port) || 3000, host: "0.0.0.0" });
  startMovementJob();
};

start();


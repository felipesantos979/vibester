import Fastify from "fastify";
import { env } from "./config/env";
import { routes } from "./routes";
import { startMovementJob } from "./jobs/movement.job";

const app = Fastify({
  logger: true,
});

app.register(routes);

app.listen({ port: Number(env.port) || 3000, host: "0.0.0.0" }).then(() => {
  startMovementJob();
});


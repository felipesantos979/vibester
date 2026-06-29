import Fastify from "fastify";
import cors from "@fastify/cors";
import { establishmentRoutes } from "./routes";
import multipart from "@fastify/multipart";
import { registerSwagger } from "./config/swagger";

const app = Fastify({
  logger: true,
  ajv: { customOptions: { keywords: ["example"] } },
});

app.register(cors, {
  origin: "*",
});
app.register(multipart);

const start = async () => {
  try {
    await registerSwagger(app);
    await app.register(establishmentRoutes);
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

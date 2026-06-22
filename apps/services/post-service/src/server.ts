import Fastify from "fastify";
import { cassandraClient } from "./config/cassandra";
import { routes } from "./routes";
import { registerSwagger } from "./config/swagger";
import { ZodError } from "zod";

const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    return reply.status(500).send({
      message: error.message,
    });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});

async function start() {
  try {
    await cassandraClient.connect();

    await registerSwagger(app);
    await app.register(routes);

    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();
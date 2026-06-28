import Fastify from "fastify";
import { getCassandraClient } from "./config/cassandra";
import { routes } from "./routes";
import { registerSwagger } from "./config/swagger";
import { ZodError } from "zod";
import multipart from "@fastify/multipart";
import { producer } from "./kafka/producer";
import { env } from "./config/env";
import { HttpError } from "./errors/http.error";

const app = Fastify();

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 20,
  },
});

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

  // Erros de negócio com código HTTP explícito
  if (error instanceof HttpError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  // Erros de validação do schema AJV do Fastify (ex: campo obrigatório ausente)
  const fastifyError = error as { statusCode?: number; message?: string };
  if (typeof fastifyError.statusCode === "number" && fastifyError.statusCode < 500) {
    return reply.status(fastifyError.statusCode).send({ message: fastifyError.message });
  }

  return reply.status(500).send({
    message: error instanceof Error ? error.message : "Internal server error",
  });
});

async function start() {
  try {
    await producer.connect();
    await getCassandraClient().connect();

    await registerSwagger(app);
    await app.register(routes);

    process.on('SIGTERM', async () => { await producer.disconnect(); });

    await app.listen({
      port: Number(env.port) || 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();
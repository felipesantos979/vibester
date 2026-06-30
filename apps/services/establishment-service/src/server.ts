import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimiter from "@fastify/rate-limit";
import { establishmentRoutes } from "./routes";
import { registerSwagger } from "./config/swagger";
import { connectRedis } from "./config/redis";
import { register, httpRequestsTotal, httpRequestDurationSeconds } from "./config/metrics";
import { env } from "./config/env";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const app = Fastify({
  logger: true,
  ajv: { customOptions: { keywords: ["example"] } },
});

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

app.register(cors, {
  origin: allowedOrigins.length > 0 ? allowedOrigins : false,
});

app.register(jwt, { secret: env.JWT_SECRET });

app.decorate("authenticate", async function (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

app.register(multipart, {
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});

if (env.NODE_ENV !== "test") {
  app.register(rateLimiter, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (req) => {
      const auth = req.headers.authorization;
      if (auth?.startsWith("Bearer ")) {
        try {
          const payload = req.server.jwt.decode<{ sub?: string }>(auth.slice(7));
          if (payload?.sub) return payload.sub;
        } catch {}
      }
      return req.ip ?? "unknown";
    },
    errorResponseBuilder: () => ({
      statusCode: 429,
      message: "Too many requests. Please try again later.",
    }),
  });
}

app.setErrorHandler((error, _request, reply) => {
  const statusCode = error.statusCode ?? 500;
  reply.code(statusCode).send({ message: error.message });
});

app.addHook("onRequest", (request, _reply, done) => {
  (request as FastifyRequest & { _startTime: number })._startTime = Date.now();
  done();
});

app.addHook("onResponse", (request, reply, done) => {
  const duration =
    (Date.now() - (request as FastifyRequest & { _startTime: number })._startTime) / 1000;
  const route = request.routeOptions?.url ?? request.url;
  const labels = {
    method: request.method,
    route,
    status_code: String(reply.statusCode),
  };
  httpRequestsTotal.inc(labels);
  httpRequestDurationSeconds.observe(labels, duration);
  done();
});

app.get("/metrics", {
  schema: { tags: ["Metrics"], summary: "Métricas Prometheus" },
}, async (_request, reply) => {
  reply.header("Content-Type", register.contentType);
  return reply.send(await register.metrics());
});

const start = async () => {
  try {
    await registerSwagger(app as unknown as FastifyInstance);
    await app.register(establishmentRoutes);
    await connectRedis();
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };

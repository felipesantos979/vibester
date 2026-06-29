import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { routes } from '../../src/routes';
import { registerSwagger } from '../../src/config/swagger';
import { env } from '../../src/config/env';

export async function buildServer() {
  const app = Fastify({
    logger: false,
    ajv: { customOptions: { keywords: ['example'] } },
  });

  await app.register(cors, { origin: env.corsOrigin });
  await app.register(jwt, { secret: env.jwtSecret });
  await app.register(rateLimit, {
    max: env.rateLimitMax,
    timeWindow: env.rateLimitTimeWindow,
    keyGenerator: () => 'test-key',
  });
  await registerSwagger(app);
  await app.register(routes);

  return app;
}

export function signTestToken(app: Awaited<ReturnType<typeof buildServer>>): string {
  return app.jwt.sign({ sub: 'test-service' });
}

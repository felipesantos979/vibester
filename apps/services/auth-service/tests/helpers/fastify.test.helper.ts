import Fastify from 'fastify';
import { authRoutes } from '../../src/routes';
import fastifyJwt from '@fastify/jwt';
import { env } from '../../src/config/env';

export async function buildServer() {
  const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });
  await app.register(fastifyJwt, { secret: env.jwtSecret || 'test-secret' });
  await app.register(authRoutes);
  return app;
}

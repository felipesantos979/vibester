import Fastify from 'fastify';
import { authRoutes } from '../../src/routes';

export async function buildServer() {
  const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });
  await app.register(authRoutes);
  return app;
}

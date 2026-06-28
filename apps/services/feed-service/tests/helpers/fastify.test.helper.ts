import Fastify from 'fastify';
import { feedRoutes } from '../../src/routes';

export async function buildServer() {
  const app = Fastify({ logger: false });
  await app.register(feedRoutes);
  return app;
}

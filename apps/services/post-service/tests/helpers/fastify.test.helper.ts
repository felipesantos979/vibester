import Fastify from 'fastify';
import { routes } from '../../src/routes';

export async function buildServer() {
  const app = Fastify({ logger: false });
  await routes(app);
  return app;
}

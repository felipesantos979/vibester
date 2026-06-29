import Fastify from 'fastify';
import { routes } from '../../src/routes';

export async function buildServer() {
  const app = Fastify({ logger: false });
  await app.register(routes);
  await app.ready();
  return app;
}

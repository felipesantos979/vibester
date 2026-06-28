import Fastify from 'fastify';
import { establishmentRoutes } from '../../src/routes';

export async function buildServer() {
  const app = Fastify({
    logger: false,
    ajv: { customOptions: { strict: false } },
  });
  await app.register(establishmentRoutes);
  return app;
}

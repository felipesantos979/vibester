import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { feedRoutes } from '../../src/routes';

const TEST_JWT_SECRET = 'test-secret';

export async function buildServer() {
  const app = Fastify({ logger: false });
  await app.register(jwt, { secret: TEST_JWT_SECRET });
  await app.register(feedRoutes);
  return app;
}

export function makeAuthHeader(app: Awaited<ReturnType<typeof buildServer>>, userId: string): string {
  const token = app.jwt.sign({ accountId: userId, userId });
  return `Bearer ${token}`;
}

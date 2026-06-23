import Fastify from 'fastify';
import { writeFileSync } from 'fs';
import { registerSwagger } from './config/swagger';
import { authRoutes } from './routes';

const app = Fastify({ ajv: { customOptions: { keywords: ['example'] } } });

(async () => {
  await registerSwagger(app);
  await app.register(authRoutes);
  await app.ready();
  writeFileSync(process.argv[2], JSON.stringify(app.swagger()));
  process.exit(0);
})();

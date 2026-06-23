import Fastify from 'fastify';
import { writeFileSync } from 'fs';
import { serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';
import { registerSwagger } from './config/swagger.js';
import { setupRoutes } from './routes.js';

const app = Fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

(async () => {
  await registerSwagger(app);
  await setupRoutes(app);
  await app.ready();
  writeFileSync(process.argv[2], JSON.stringify(app.swagger()));
  process.exit(0);
})();

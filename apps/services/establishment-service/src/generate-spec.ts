import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import { writeFileSync } from 'fs';
import { establishmentRoutes } from './routes';

const app = Fastify({ ajv: { customOptions: { keywords: ['example'] } } });

app.decorate('authenticate', async (_req: unknown, _rep: unknown) => {});

(async () => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Establishment Service API',
        description:
          'Documentação da API do serviço de estabelecimentos do Vibester (listagem, filtros, perfil e avaliações).',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      tags: [
        { name: 'Health', description: 'Verificação de saúde do serviço' },
        { name: 'Establishments', description: 'Estabelecimentos' },
        { name: 'Metrics', description: 'Métricas Prometheus' },
      ],
    },
  });
  await app.register(establishmentRoutes);
  await app.ready();
  writeFileSync(process.argv[2], JSON.stringify(app.swagger()));
  process.exit(0);
})();

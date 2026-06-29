import Fastify from 'fastify';
import { writeFile } from 'fs/promises';

const REQUIRED_VARS = [
    'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME', 'R2_PUBLIC_URL',
    'ASTRA_SECURE_CONNECT_BUNDLE', 'ASTRA_CLIENT_ID', 'ASTRA_CLIENT_SECRET',
    'ASTRA_TOKEN', 'ASTRA_KEYSPACE', 'KAFKA_BROKERS',
];
for (const key of REQUIRED_VARS) {
    process.env[key] ??= 'placeholder';
}

(async () => {
    const app = Fastify({ ajv: { customOptions: { keywords: ['example'] } } });
    try {
        const { registerSwagger } = await import('./config/swagger.js');
        const { routes } = await import('./routes.js');
        await registerSwagger(app);
        await app.register(routes);
        await app.ready();
        const spec = JSON.stringify(app.swagger(), null, 2);
        await writeFile(process.argv[2], spec, 'utf8');
        process.exit(0);
    } catch (err) {
        console.error('[generate-spec] Erro ao gerar swagger spec:', err);
        process.exit(1);
    }
})();

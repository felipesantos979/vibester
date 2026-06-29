import Fastify from 'fastify';
import { writeFile } from 'fs/promises';
import { registerSwagger } from './config/swagger';
import { routes } from './routes';

const app = Fastify({ ajv: { customOptions: { keywords: ['example'] } } });

(async () => {
    try {
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

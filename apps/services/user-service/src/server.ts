import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';
import { env } from './config/env.js';
import { redis } from './config/redis.js';
import { setupRoutes } from './routes.js';
import { registerSwagger } from './config/swagger.js';
import { producer } from './kafka/producer.js';
import { startConsumer } from './kafka/consumer.js';

const app = Fastify({
    logger: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const port = Number(env.port) || 3003;

const shutdown = async () => {
    app.log.info('Graceful shutdown iniciado');
    await app.close();
    await producer.disconnect();
    await redis.quit();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const start = async () => {
    await redis.connect();
    await producer.connect();
    await startConsumer();

    // CORS desabilitado: serviço interno ClusterIP sem acesso direto de browser
    await app.register(cors, { origin: false });

    // JWT registrado para uso em rotas autenticadas
    // TODO: aplicar verifyJWT como preHandler nas rotas que exigem autenticação de usuário
    await app.register(jwt, { secret: env.jwtSecret });

    await app.register(rateLimit, {
        global: false,
        redis,
    });

    await registerSwagger(app);
    await setupRoutes(app);

    try {
        await app.listen({ port, host: '0.0.0.0' });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();

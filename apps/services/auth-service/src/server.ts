import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { authRoutes } from './routes';
import { env } from './config/env';
import { registerSwagger } from './config/swagger';
import { producer } from './kafka/producer';

const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });
const port = env.port || 3001;

const start = async () => {
    await producer.connect();

    await app.register(cors);
    await registerSwagger(app);
    await app.register(fastifyJwt, { secret: env.jwtSecret });
    await app.register(authRoutes);

    process.on('SIGTERM', async () => { await producer.disconnect(); });

    try {
        await app.listen({ port: 3001, host: '0.0.0.0' });
    } catch (err) {
        process.exit(1);
    }

}

start();
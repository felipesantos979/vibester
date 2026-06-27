import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { authRoutes } from './routes';
import { env } from './config/env';
import { registerSwagger } from './config/swagger';
const app = Fastify({ ajv: { customOptions: { keywords: ["example"] } } });
const port = env.port || 3001;

const start = async () => {
    await app.register(cors);
    await registerSwagger(app);
    await app.register(fastifyJwt, { secret: env.jwtSecret });
    await app.register(authRoutes);

    try {
        await app.listen({ port: 3001, host: '0.0.0.0' });
    } catch (err) {
        process.exit(1);
    }

}

start();
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';
import { setupRoutes } from './routes.js';

const app = Fastify();
const port = Number(env.port) || 3003;

const start = async () => {
    await app.register(cors);
    await setupRoutes(app);

    try {
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`User-service listening on port ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }   
}

start();

import Fastify from 'fastify';
import cors from '@fastify/cors';

import { env } from './config/env';
import { setupRoutes } from './routes';

const app = Fastify();
const port = env.port;

const start = async () => {
    await app.register(cors);
    await setupRoutes(app);

    try {
        await app.listen({port: 3334});
    } catch (error) {
        process.exit(1);
    }

    
};

start();
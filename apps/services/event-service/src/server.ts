import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';

import { env } from './config/env';
import { setupRoutes } from './routes';
import { registerSwagger } from './config/swagger';

const app = Fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const port = env.port;

const start = async () => {
    await app.register(cors);
    await registerSwagger(app);
    await setupRoutes(app);

    try {
        await app.listen({ port: 3334, host: '0.0.0.0' });
    } catch (error) {
        process.exit(1);
    }
};

start();

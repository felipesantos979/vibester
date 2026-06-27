import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';
import { env } from './config/env.js';
import { setupRoutes } from './routes.js';
import { registerSwagger } from './config/swagger.js';
import { producer } from './kafka/producer.js';

const app = Fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const port = Number(env.port) || 3003;

const start = async () => {
    await producer.connect();

    await app.register(cors);
    await registerSwagger(app);
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

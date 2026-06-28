import Fastify from "fastify";
import cors from "@fastify/cors";
import { feedRoutes } from "./routes";
import { registerSwagger } from "./config/swagger";
import { KafkaConsumer } from "./kafka/consumer";
import { FeedService } from "./services/feed.service";

const app = Fastify();

async function start() {
    await app.register(cors, {
        origin: true,
    });

    await registerSwagger(app);
    await app.register(feedRoutes);

    const feedService = new FeedService();
    const kafkaConsumer = new KafkaConsumer(feedService);

    await kafkaConsumer.start();

    await app.listen({
        port: 3006,
        host: "0.0.0.0",
    });

    console.log("Feed service running on port 3006");
}

start().catch((error) => {
    console.error(error);
    process.exit(1);
});
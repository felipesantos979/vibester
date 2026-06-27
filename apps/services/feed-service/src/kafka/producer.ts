import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
    clientId: "feed-service-mock",
    brokers: [process.env.KAFKA_BROKERS!]
});

export const producer = kafka.producer();
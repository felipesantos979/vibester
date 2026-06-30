import { Kafka } from "kafkajs";
import { env } from "../config/env";

export const kafka = new Kafka({
  clientId: "establishment-service",
  brokers: [env.KAFKA_BROKERS],
});

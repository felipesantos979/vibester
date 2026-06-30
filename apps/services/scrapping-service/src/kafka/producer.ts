import { Kafka, Producer } from "kafkajs";
import { env } from "../config/env";

let _producer: Producer | null = null;

function getProducer(): Producer {
  if (!_producer) {
    const kafka = new Kafka({
      clientId: "scrapping-service",
      brokers: [env.kafkaBrokers],
    });
    _producer = kafka.producer();
  }
  return _producer;
}

export const kafkaProducer = {
  connect: () => getProducer().connect(),
  disconnect: () => _producer?.disconnect() ?? Promise.resolve(),
  send: (record: Parameters<Producer["send"]>[0]) => getProducer().send(record),
};

import { Kafka } from 'kafkajs';
import { env } from '../config/env';

const kafka = new Kafka({ clientId: 'post-service', brokers: env.kafkaBrokers.split(',') });
export const producer = kafka.producer();

import { Kafka } from 'kafkajs';
import { env } from '../config/env';

const kafka = new Kafka({ clientId: 'auth-service', brokers: env.kafkaBrokers.split(',') });
export const producer = kafka.producer();

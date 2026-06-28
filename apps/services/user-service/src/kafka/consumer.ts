import { Kafka } from 'kafkajs';
import { env } from '../config/env.js';
import { CreateProfileService } from '../services/createProfile.service.js';

const kafka = new Kafka({ clientId: 'user-service', brokers: env.kafkaBrokers.split(',') });
const consumer = kafka.consumer({ groupId: 'user-service-group' });
const createProfileService = new CreateProfileService();

export async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user.registered', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value!.toString());
            await createProfileService.createProfile({ accountId: payload.accountId });
        },
    });
}

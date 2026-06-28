import type { Producer } from 'kafkajs';
import { env } from '../config/env';

let _producer: Producer | null = null;

function getProducer(): Producer {
    if (!_producer) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Kafka } = require('kafkajs');
        const kafka = new Kafka({ clientId: 'post-service', brokers: env.kafkaBrokers.split(',') });
        _producer = kafka.producer();
    }
    return _producer;
}

export const producer = {
    connect: () => getProducer().connect(),
    disconnect: () => _producer?.disconnect() ?? Promise.resolve(),
    send: (record: Parameters<Producer['send']>[0]) => getProducer().send(record),
};

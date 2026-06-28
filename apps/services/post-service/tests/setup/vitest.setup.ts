import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: 3005,
    cassandra_contact_point: 'localhost',
    cassandra_keyspace: 'test_keyspace',
    cassandra_datacenter: 'datacenter1',
    kafkaBrokers: 'localhost:9092',
  },
}));

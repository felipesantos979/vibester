import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: '3005',
    secure_connect_bundle: '/fake/bundle.zip',
    astra_client_id: 'test-client-id',
    astra_client_secret: 'test-client-secret',
    astra_token: 'test-token',
    keyspace: 'test_keyspace',
    kafka_brokers: 'localhost:9092',
    r2_account_id: 'test-r2-account',
    r2_access_key_id: 'test-r2-key',
    r2_secret_access_key: 'test-r2-secret',
    r2_bucket_name: 'test-bucket',
    r2_public_url: 'https://test.r2.dev',
    redis_url: 'redis://localhost:6379',
  },
}));

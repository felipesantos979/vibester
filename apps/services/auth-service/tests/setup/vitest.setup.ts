import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: 3001,
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    databaseUrl: 'postgresql://user:pass@localhost:5432/db',
    profileServiceUrl: 'http://localhost:3002',
    kafkaBrokers: 'localhost:9092',
  },
}));

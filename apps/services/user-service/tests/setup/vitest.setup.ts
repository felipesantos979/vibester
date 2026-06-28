import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: 3002,
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    databaseUrl: 'postgresql://user:pass@localhost:5432/test',
    profileServiceUrl: 'http://localhost:3001',
    kafkaBrokers: 'localhost:9092',
  },
}));

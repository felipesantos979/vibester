import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: 3003,
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    databaseUrl: 'postgresql://user:pass@localhost:5432/test',
  },
}));

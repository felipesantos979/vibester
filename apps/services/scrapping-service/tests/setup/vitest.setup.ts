import { vi } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    port: 3007,
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    databaseUrl: 'postgresql://user:pass@localhost:5432/test',
    serpapiKey: 'test-serpapi-key',
    googleKey: 'test-google-key',
    establishmentServiceUrl: 'http://localhost:3003',
    timezone: 'America/Sao_Paulo',
  },
}));

// Global jest setup

// Replace env module with mocked env during tests
jest.mock('../../src/config/env', () => ({
  __esModule: true,
  env: {
    port: 3001,
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    databaseUrl: 'postgresql://user:pass@localhost:5432/db',
    profileServiceUrl: 'http://localhost:3002',
  }
}));

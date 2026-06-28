export const env = {
  port: 3001,
  jwtSecret: 'test-secret',
  jwtExpiresIn: '1h',
  jwtRefreshExpiresIn: '7d',
  databaseUrl: 'postgresql://user:pass@localhost:5432/db',
  profileServiceUrl: 'http://localhost:3002',
  kafkaBrokers: 'localhost:9092',
  corsOrigin: false as false,
  fetchTimeoutMs: 5000,
  rateLimitMax: 60,
};
export default env;

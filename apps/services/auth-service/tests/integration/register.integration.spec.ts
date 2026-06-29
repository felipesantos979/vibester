import { vi } from 'vitest';
import prismaMock, { mockAccess } from '../mocks/prisma.client';

vi.mock('../../src/prisma', () => ({ default: prismaMock }));

vi.mock('../../src/config/redis', async () => ({
  redis: (await import('../mocks/redis')).redisMock,
}));

vi.mock('../../src/kafka/producer', async () => ({
  producer: (await import('../mocks/kafka.producer')).producerMock,
}));

import { buildServer } from '../helpers/fastify.test.helper';
import { redisMock } from '../mocks/redis';

const validPayload = { username: 'u', name: 'n', email: 'u@example.com', password: 'secret', bornAt: '1990-01-01' };

describe('Register integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
    redisMock.set.mockResolvedValue('OK');
  });

  it('POST /register returns 202 and sends verification code when input is unique', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    const res = await app.inject({ method: 'POST', url: '/register', payload: validPayload });

    expect(res.statusCode).toBe(202);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('message');
  });

  it('POST /register returns 409 when email or username already exists', async () => {
    mockAccess.findFirst.mockResolvedValueOnce({ id: 'existing-id' });

    const res = await app.inject({ method: 'POST', url: '/register', payload: validPayload });

    expect(res.statusCode).toBe(409);
  });

  it('POST /register returns 400 when required fields are missing', async () => {
    const res = await app.inject({ method: 'POST', url: '/register', payload: { email: 'u@example.com' } });

    expect(res.statusCode).toBe(400);
  });
});

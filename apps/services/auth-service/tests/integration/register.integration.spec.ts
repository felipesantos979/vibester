import { vi } from 'vitest';
import prismaMock, { mockAccess } from '../mocks/prisma.client';

vi.mock('../../src/prisma', () => ({ default: prismaMock }));

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'signed-token') },
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { buildServer } from '../helpers/fastify.test.helper';

describe('Register integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ accountId: 'acc-1' }),
    });
  });

  it('POST /register returns 201 with authId and accountId', async () => {
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: 'u', email: 'e', createdAt: new Date(), updatedAt: new Date() });

    const res = await app.inject({ method: 'POST', url: '/register', payload: { username: 'u', name: 'n', email: 'u@example.com', password: 'secret', bornAt: '1990-01-01' } });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('authId');
    expect(body).toHaveProperty('accountId');
    expect(body).toHaveProperty('username');
  });

  it('POST /register returns 400 when user-service fails', async () => {
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: 'u', email: 'e', createdAt: new Date(), updatedAt: new Date() });
    mockFetch.mockResolvedValueOnce({ ok: false });

    const res = await app.inject({ method: 'POST', url: '/register', payload: { username: 'u', name: 'n', email: 'u@example.com', password: 'secret', bornAt: '1990-01-01' } });

    expect(res.statusCode).toBe(400);
  });
});

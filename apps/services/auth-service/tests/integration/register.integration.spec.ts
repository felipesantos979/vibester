import { vi } from 'vitest';
import prismaMock, { mockAccess } from '../mocks/prisma.client';

vi.mock('../../src/prisma', () => ({ default: prismaMock }));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { buildServer } from '../helpers/fastify.test.helper';

const validPayload = { username: 'u', name: 'n', email: 'u@example.com', password: 'secret', bornAt: '1990-01-01' };
const baseAccount = { id: '1', accountId: 'acc-1', username: 'u', email: 'u@example.com', createdAt: new Date(), updatedAt: new Date() };

describe('Register integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ accountId: 'acc-1' }),
    });
  });

  it('POST /register returns 201 with authId and accountId', async () => {
    mockAccess.create.mockResolvedValueOnce(baseAccount);

    const res = await app.inject({ method: 'POST', url: '/register', payload: validPayload });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('authId');
    expect(body).toHaveProperty('accountId');
    expect(body).toHaveProperty('username');
  });

  it('POST /register returns 502 and rolls back when user-service fails', async () => {
    mockAccess.create.mockResolvedValueOnce(baseAccount);
    mockAccess.delete.mockResolvedValueOnce(undefined);
    mockFetch.mockResolvedValueOnce({ ok: false });

    const res = await app.inject({ method: 'POST', url: '/register', payload: validPayload });

    expect(res.statusCode).toBe(502);
    expect(mockAccess.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('POST /register returns 409 when email/username already exists', async () => {
    const p2002 = Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    mockAccess.create.mockRejectedValueOnce(p2002);

    const res = await app.inject({ method: 'POST', url: '/register', payload: validPayload });

    expect(res.statusCode).toBe(409);
  });
});

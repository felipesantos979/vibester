import prismaMock, { mockAccess } from '../mocks/prisma.client';
jest.mock('../../src/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed-token'),
}));

import { buildServer } from '../helpers/fastify.test.helper';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { makeUser } from '../factories/user.factory';

describe('Login integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => app.close());

  beforeEach(() => jest.clearAllMocks());

  it('POST /login success returns 200 and token', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

  const res = await app.inject({ method: 'POST', url: '/login', payload: { email: user.email, password: 'secretpw' } });
  expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('token');
    expect(body.id).toBe(user.id);
  });

  it('POST /login invalid password returns 500', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

  const res = await app.inject({ method: 'POST', url: '/login', payload: { email: user.email, password: 'wrongpw' } });
  expect(res.statusCode).toBe(500);
  });
});

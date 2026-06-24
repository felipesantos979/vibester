import prismaMock, { mockAccess } from '../mocks/prisma.client';
jest.mock('../../src/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));
import { buildServer } from '../helpers/fastify.test.helper';

describe('Register integration', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => app.close());

  it('POST /register returns 201 on success', async () => {
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: 'u', email: 'e', createdAt: new Date(), updatedAt: new Date() });

    const res = await app.inject({ method: 'POST', url: '/register', payload: { username: 'u', name: 'n', email: 'u@example.com', password: 'secret', bornAt: '1990-01-01' } });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('id');
  });
});

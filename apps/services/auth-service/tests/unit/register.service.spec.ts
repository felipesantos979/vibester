const prismaMockRequire = require('../mocks/prisma.client') as any;
jest.mock('../../src/prisma/index', () => ({
  __esModule: true,
  default: prismaMockRequire.default,
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn((p) => `hashed-${p}`),
}));

import { RegisterService } from '../../src/services/register.service';
import prismaMock, { mockAccess } from '../mocks/prisma.client';
import bcrypt from 'bcryptjs';
import { makeUser } from '../factories/user.factory';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RegisterService();
  });

  it('should register successfully', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });

    const result = await service.register(input as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(mockAccess.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
    expect(result.username).toBe(input.username);
  });

  it('should handle profile service failure gracefully', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });

    // simulate fetch failing by mocking global.fetch
    const originalFetch = global.fetch;
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.reject(new Error('network')));

    const result = await service.register(input as any);

    expect(result).toHaveProperty('id');

    // restore
    global.fetch = originalFetch;
  });
});

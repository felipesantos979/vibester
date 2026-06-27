import { vi } from 'vitest';

vi.mock('../../src/prisma', async () => ({
  default: (await import('../mocks/prisma.client')).default,
}));

vi.mock('bcryptjs', () => {
  const compare = vi.fn();
  return { default: { compare }, compare };
});

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'token') },
}));

import { LoginService } from '../../src/services/login.service';
import { mockAccess } from '../mocks/prisma.client';
import bcrypt from 'bcryptjs';
import { makeUser } from '../factories/user.factory';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LoginService();
  });

  it('should login successfully with email', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);

    const result = await service.login({ email: user.email, password: 'plain' });

    expect(mockAccess.findFirst).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
    expect(result).toHaveProperty('token');
    expect(result.id).toBe(user.id);
  });

  it('should throw when user not found', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    await expect(service.login({ email: 'no@user.com', password: 'x' })).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('should throw when password invalid', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

    await expect(service.login({ email: user.email, password: 'wrong' })).rejects.toThrow('Usuário ou senha inválidos');
  });
});

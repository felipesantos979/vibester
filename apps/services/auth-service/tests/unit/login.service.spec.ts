import { vi } from 'vitest';

vi.mock('../../src/prisma/index', async () => ({
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
    expect(result.authId).toBe(user.id);
  });

  it('should pass only defined fields to OR query', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    await service.login({ email: 'a@b.com', password: 'x' }).catch(() => {});

    const call = mockAccess.findFirst.mock.calls[0][0];
    expect(call.where.OR).toHaveLength(1);
    expect(call.where.OR[0]).toEqual({ email: 'a@b.com' });
  });

  it('should throw AppError 401 when user not found', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    const err: any = await service.login({ email: 'no@user.com', password: 'x' }).catch(e => e);

    expect(err.name).toBe('AppError');
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Usuário ou senha inválidos');
  });

  it('should throw AppError 401 when password invalid', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

    const err: any = await service.login({ email: user.email, password: 'wrong' }).catch(e => e);

    expect(err.name).toBe('AppError');
    expect(err.statusCode).toBe(401);
  });
});

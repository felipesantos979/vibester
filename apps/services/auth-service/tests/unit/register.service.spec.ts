import { vi } from 'vitest';

vi.mock('../../src/prisma/index', async () => ({
  default: (await import('../mocks/prisma.client')).default,
}));

vi.mock('bcryptjs', () => {
  const hash = vi.fn((p: string) => `hashed-${p}`);
  return { default: { hash }, hash };
});

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { RegisterService } from '../../src/services/register.service';
import { mockAccess } from '../mocks/prisma.client';
import bcrypt from 'bcryptjs';

const baseInput = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
const baseAccount = { id: '1', accountId: 'acc-1', username: 'newuser', email: 'new@example.com', createdAt: new Date(), updatedAt: new Date() };

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ accountId: 'acc-1' }),
    });
    service = new RegisterService();
  });

  it('should register successfully and return authId and accountId', async () => {
    mockAccess.create.mockResolvedValueOnce(baseAccount);

    const result = await service.register(baseInput as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(mockAccess.create).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/profile'),
      expect.objectContaining({ method: 'POST', signal: expect.any(AbortSignal) }),
    );
    expect(result).toHaveProperty('authId', '1');
    expect(result).toHaveProperty('accountId', 'acc-1');
    expect(result.username).toBe('newuser');
  });

  it('should rollback and throw AppError 502 when user-service fails', async () => {
    mockAccess.create.mockResolvedValueOnce(baseAccount);
    mockAccess.delete.mockResolvedValueOnce(undefined);
    mockFetch.mockResolvedValueOnce({ ok: false });

    const err: any = await service.register(baseInput as any).catch(e => e);

    expect(mockAccess.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(err.name).toBe('AppError');
    expect(err.statusCode).toBe(502);
    expect(err.message).toBe('Serviço de perfil indisponível');
  });

  it('should rollback and throw when fetch rejects (timeout)', async () => {
    mockAccess.create.mockResolvedValueOnce(baseAccount);
    mockAccess.delete.mockResolvedValueOnce(undefined);
    mockFetch.mockRejectedValueOnce(new Error('AbortError'));

    await expect(service.register(baseInput as any)).rejects.toThrow('AbortError');
    expect(mockAccess.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should throw AppError 409 when email/username already exists', async () => {
    const p2002 = Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    mockAccess.create.mockRejectedValueOnce(p2002);

    const err: any = await service.register(baseInput as any).catch(e => e);

    expect(err.name).toBe('AppError');
    expect(err.statusCode).toBe(409);
  });
});

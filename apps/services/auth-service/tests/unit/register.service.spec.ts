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

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ profileId: 'profile-uuid-1' }),
    });
    service = new RegisterService();
  });

  it('should register successfully and return authId and profileId', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });

    const result = await service.register(input as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(mockAccess.create).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/profile'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toHaveProperty('authId', '1');
    expect(result).toHaveProperty('profileId', 'profile-uuid-1');
    expect(result.username).toBe(input.username);
  });

  it('should throw when user-service profile creation fails', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(service.register(input as any)).rejects.toThrow('Failed to create user profile');
  });
});

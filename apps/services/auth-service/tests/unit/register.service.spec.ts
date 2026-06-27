import { vi } from 'vitest';

vi.mock('../../src/prisma/index', async () => ({
  default: (await import('../mocks/prisma.client')).default,
}));

vi.mock('bcryptjs', () => {
  const hash = vi.fn((p: string) => `hashed-${p}`);
  return { default: { hash }, hash };
});

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'signed-token') },
}));

vi.mock('../../src/kafka/producer', () => ({
  producer: { send: vi.fn() },
}));

import { RegisterService } from '../../src/services/register.service';
import { producer } from '../../src/kafka/producer';
import { mockAccess } from '../mocks/prisma.client';
import bcrypt from 'bcryptjs';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(producer.send).mockResolvedValue(undefined as any);
    service = new RegisterService();
  });

  it('should register successfully', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });

    const result = await service.register(input as any);

    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(mockAccess.create).toHaveBeenCalled();
    expect(vi.mocked(producer.send)).toHaveBeenCalledWith(expect.objectContaining({ topic: 'user.registered' }));
    expect(result).toHaveProperty('id');
    expect(result.username).toBe(input.username);
  });

  it('should handle kafka failure gracefully', async () => {
    const input = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };
    mockAccess.create.mockResolvedValueOnce({ id: '1', accountId: 'acc-1', username: input.username, email: input.email, createdAt: new Date(), updatedAt: new Date() });
    vi.mocked(producer.send).mockRejectedValueOnce(new Error('kafka unavailable'));

    const result = await service.register(input as any);

    expect(result).toHaveProperty('id');
  });
});

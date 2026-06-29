import { vi } from 'vitest';

vi.mock('../../src/prisma/index', async () => ({
  default: (await import('../mocks/prisma.client')).default,
}));

vi.mock('../../src/config/redis', async () => ({
  redis: (await import('../mocks/redis')).redisMock,
}));

vi.mock('../../src/kafka/producer', async () => ({
  producer: (await import('../mocks/kafka.producer')).producerMock,
}));

vi.mock('bcryptjs', () => {
  const hash = vi.fn((p: string) => `hashed-${p}`);
  return { default: { hash }, hash };
});

import { RegisterService } from '../../src/services/register.service';
import { mockAccess } from '../mocks/prisma.client';

const baseInput = { username: 'newuser', email: 'new@example.com', password: 'secret', name: 'New', bornAt: new Date() };

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RegisterService();
  });

  it('should initiate verification and return void when input is unique', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    await expect(service.register(baseInput as any)).resolves.toBeUndefined();

    expect(mockAccess.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ OR: expect.any(Array) }) }),
    );
  });

  it('should throw AppError 409 when email or username already exists', async () => {
    mockAccess.findFirst.mockResolvedValueOnce({ id: 'existing-id' });

    const err: any = await service.register(baseInput as any).catch(e => e);

    expect(err.name).toBe('AppError');
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe('Email ou username já está em uso');
  });
});

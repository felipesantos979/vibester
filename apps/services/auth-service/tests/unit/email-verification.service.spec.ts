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
  const hash = vi.fn((_p: string) => Promise.resolve('hashed-password'));
  return { default: { hash }, hash };
});

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { EmailVerificationService } from '../../src/services/email-verification.service';
import { mockAccess } from '../mocks/prisma.client';
import { redisMock } from '../mocks/redis';
import { producerMock } from '../mocks/kafka.producer';

const baseInput = {
  username: 'newuser',
  email: 'new@example.com',
  password: 'secret123',
  name: 'New User',
  bornAt: new Date('1990-01-01'),
};

const pendingData = {
  username: 'newuser',
  name: 'New User',
  email: 'new@example.com',
  passwordHash: 'hashed-password',
  bornAt: new Date('1990-01-01').toISOString(),
  code: '482931',
};

const baseAccount = {
  id: 'auth-1',
  accountId: 'acc-1',
  username: 'newuser',
  email: 'new@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EmailVerificationService();
  });

  describe('initiate', () => {
    it('should store pending registration in Redis and publish Kafka event', async () => {
      await service.initiate(baseInput as any);

      expect(redisMock.set).toHaveBeenCalledWith(
        expect.stringContaining('pending:reg:new@example.com'),
        expect.stringContaining('"email":"new@example.com"'),
        600,
      );

      expect(producerMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'auth.email.verification',
          messages: expect.arrayContaining([
            expect.objectContaining({ value: expect.stringContaining('"email":"new@example.com"') }),
          ]),
        }),
      );
    });
  });

  describe('verify', () => {
    it('should throw 404 when no pending registration exists', async () => {
      redisMock.get.mockResolvedValueOnce(null);

      const err: any = await service.verify('new@example.com', '482931').catch(e => e);

      expect(err.name).toBe('AppError');
      expect(err.statusCode).toBe(404);
    });

    it('should throw 422 when code does not match', async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(pendingData));

      const err: any = await service.verify('new@example.com', '000000').catch(e => e);

      expect(err.name).toBe('AppError');
      expect(err.statusCode).toBe(422);
      expect(err.message).toBe('Código de verificação inválido');
    });

    it('should create account, call user-service, and return output on valid code', async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(pendingData));
      mockAccess.create.mockResolvedValueOnce(baseAccount);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ accountId: 'acc-1' }),
      });

      const result = await service.verify('new@example.com', '482931');

      expect(redisMock.del).toHaveBeenCalledWith('pending:reg:new@example.com');
      expect(mockAccess.create).toHaveBeenCalled();
      expect(result).toHaveProperty('authId', 'auth-1');
      expect(result).toHaveProperty('accountId', 'acc-1');
      expect(result.username).toBe('newuser');
    });

    it('should rollback account and throw AppError 502 when user-service fails', async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(pendingData));
      mockAccess.create.mockResolvedValueOnce(baseAccount);
      mockAccess.delete.mockResolvedValueOnce(undefined);
      mockFetch.mockResolvedValueOnce({ ok: false });

      const err: any = await service.verify('new@example.com', '482931').catch(e => e);

      expect(mockAccess.delete).toHaveBeenCalledWith({ where: { id: 'auth-1' } });
      expect(err.name).toBe('AppError');
      expect(err.statusCode).toBe(502);
    });

    it('should throw AppError 409 when account creation hits unique constraint', async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(pendingData));
      const p2002 = Object.assign(new Error('Unique constraint'), { code: 'P2002' });
      mockAccess.create.mockRejectedValueOnce(p2002);

      const err: any = await service.verify('new@example.com', '482931').catch(e => e);

      expect(err.name).toBe('AppError');
      expect(err.statusCode).toBe(409);
    });
  });
});

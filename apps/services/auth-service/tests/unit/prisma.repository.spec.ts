import { vi } from 'vitest';
import prismaMock, { mockAccess } from '../mocks/prisma.client';

describe('Prisma repository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should create access record', async () => {
    mockAccess.create.mockResolvedValueOnce({ id: '1' });

    const res = await prismaMock.access.create({ data: { username: 'u' } } as any);

    expect(mockAccess.create).toHaveBeenCalled();
    expect(res).toEqual({ id: '1' });
  });

  it('should findFirst access', async () => {
    mockAccess.findFirst.mockResolvedValueOnce({ id: '1' });

    const res = await prismaMock.access.findFirst({ where: { email: 'e' } } as any);

    expect(mockAccess.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: '1' });
  });
});

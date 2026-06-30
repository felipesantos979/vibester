import { vi } from 'vitest';

export const mockUserProfile = {
  create: vi.fn(),
  findUnique: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
  update: vi.fn(),
  findUniqueOrThrow: vi.fn(),
};

export const mockUserFollow = {
  create: vi.fn(),
  delete: vi.fn(),
  findMany: vi.fn(),
};

const prisma = {
  userProfile: mockUserProfile,
  userFollow: mockUserFollow,
  $transaction: vi.fn().mockImplementation((arg: ((...args: unknown[]) => unknown) | Promise<unknown>[]) => {
    if (typeof arg === 'function') {
      return arg({ userProfile: mockUserProfile, userFollow: mockUserFollow });
    }
    return Promise.all(arg);
  }),
  $queryRaw: vi.fn().mockResolvedValue([]),
};

export default prisma;

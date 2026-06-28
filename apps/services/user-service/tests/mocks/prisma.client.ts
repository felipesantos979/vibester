import { vi } from 'vitest';

export const mockUserProfile = {
  create: vi.fn(),
  findUnique: vi.fn(),
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
  $transaction: vi.fn().mockImplementation((fn: Function) =>
    fn({ userProfile: mockUserProfile, userFollow: mockUserFollow })
  ),
  $queryRaw: vi.fn().mockResolvedValue([]),
};

export default prisma;

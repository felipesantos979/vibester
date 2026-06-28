import { vi } from 'vitest';

export const mockEvent = {
  create: vi.fn(),
  findUnique: vi.fn(),
  findMany: vi.fn(),
};

const prisma = { event: mockEvent };
export default prisma;

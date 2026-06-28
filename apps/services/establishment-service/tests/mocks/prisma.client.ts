import { vi } from 'vitest';

export const mockEstablishment = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
};

const prisma = { establishment: mockEstablishment };
export default prisma;

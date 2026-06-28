import { vi } from 'vitest';

const mockAccess = {
  findFirst: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
};

const prisma = {
  access: mockAccess,
};

export default prisma;
export { mockAccess };

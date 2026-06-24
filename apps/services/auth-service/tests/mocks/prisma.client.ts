// Mock minimal Prisma client methods used in services
const mockAccess = {
  findFirst: jest.fn(),
  create: jest.fn(),
};

const prisma = {
  access: mockAccess,
};

export default prisma;
export { mockAccess };

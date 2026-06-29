import { vi } from "vitest";

export const mockEvent = {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
};

const prisma = {
    event: mockEvent,
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
};

export default prisma;

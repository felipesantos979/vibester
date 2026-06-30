import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListUserCheckInsService } from "../listUserCheckIns.service";

const { mockFindMany } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
    default: {
        eventCheckIn: { findMany: mockFindMany },
    },
}));

describe("ListUserCheckInsService", () => {
    let service: ListUserCheckInsService;

    beforeEach(() => {
        service = new ListUserCheckInsService();
        vi.clearAllMocks();
    });

    it("deve retornar eventos com checkedInAt", async () => {
        const checkedInAt = new Date("2026-07-01T12:00:00.000Z");
        const event = {
            id: "event-1",
            name: "Show do Rock",
            startDate: new Date("2026-07-01T20:00:00.000Z"),
        };
        mockFindMany.mockResolvedValue([{ event, createdAt: checkedInAt }]);

        const result = await service.list("user-1");

        expect(result).toEqual([{ ...event, checkedInAt }]);
        expect(mockFindMany).toHaveBeenCalledWith({
            where: { userId: "user-1" },
            include: { event: true },
            orderBy: { event: { startDate: "asc" } },
        });
    });

    it("deve retornar lista vazia quando usuário não tem check-ins", async () => {
        mockFindMany.mockResolvedValue([]);
        const result = await service.list("user-1");
        expect(result).toEqual([]);
    });
});

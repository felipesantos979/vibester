import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckUserCheckInService } from "../checkUserCheckIn.service";

const { mockFindUnique } = vi.hoisted(() => ({
    mockFindUnique: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
    default: {
        eventCheckIn: { findUnique: mockFindUnique },
    },
}));

describe("CheckUserCheckInService", () => {
    let service: CheckUserCheckInService;

    beforeEach(() => {
        service = new CheckUserCheckInService();
        vi.clearAllMocks();
    });

    it("deve retornar { checkedIn: true } quando check-in existe", async () => {
        mockFindUnique.mockResolvedValue({ id: "checkin-id" });
        const result = await service.check("event-1", "user-1");
        expect(result).toEqual({ checkedIn: true });
        expect(mockFindUnique).toHaveBeenCalledWith({
            where: { eventId_userId: { eventId: "event-1", userId: "user-1" } },
            select: { id: true },
        });
    });

    it("deve retornar { checkedIn: false } quando check-in não existe", async () => {
        mockFindUnique.mockResolvedValue(null);
        const result = await service.check("event-1", "user-1");
        expect(result).toEqual({ checkedIn: false });
    });
});

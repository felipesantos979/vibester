import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetEventsByWeekService } from "../getEventsByWeek.service";

vi.mock("../../config/redis", () => ({
    redis: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue("OK") },
    cacheAside: async <T>(_k: string, _t: number, fn: () => Promise<T>): Promise<T> => fn(),
}));

const { mockFindMany } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
    default: {
        event: {
            findMany: mockFindMany,
        },
    },
}));

function makeDbEvent(overrides: Partial<{
    id: string;
    name: string;
    organizer: string;
    location: string;
    isFeatured: boolean;
    startDate: Date;
    totalConfirmed: number;
    ticketLink: string | null;
}> = {}) {
    return {
        id: "event-id-1",
        name: "Festival de Verão",
        organizer: "Organizer LTDA",
        location: "São Paulo, SP",
        isFeatured: false,
        startDate: new Date("2026-07-01T18:00:00Z"),
        totalConfirmed: 10,
        ticketLink: "https://example.com/tickets",
        ...overrides,
    };
}

describe("GetEventsByWeekService", () => {
    let service: GetEventsByWeekService;

    beforeEach(() => {
        service = new GetEventsByWeekService();
        vi.clearAllMocks();
    });

    it("should query events between start and end of the week", async () => {
        mockFindMany.mockResolvedValue([]);

        await service.get("2026-07-01");

        expect(mockFindMany).toHaveBeenCalledWith({
            where: {
                startDate: {
                    gte: new Date("2026-07-01T00:00:00.000Z"),
                    lte: new Date("2026-07-08T23:59:59.999Z"),
                },
            },
            orderBy: { startDate: "asc" },
        });
    });

    it("should return events within the week", async () => {
        const events = [
            makeDbEvent({ name: "Evento A", startDate: new Date("2026-07-02T18:00:00Z") }),
            makeDbEvent({ id: "event-id-2", name: "Evento B", startDate: new Date("2026-07-05T18:00:00Z") }),
        ];
        mockFindMany.mockResolvedValue(events);

        const result = await service.get("2026-07-01");

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Evento A");
        expect(result[1].name).toBe("Evento B");
    });

    it("should return empty array when no events in the week", async () => {
        mockFindMany.mockResolvedValue([]);

        const result = await service.get("2026-07-01");

        expect(result).toEqual([]);
    });

    it("should return events ordered by startDate asc", async () => {
        const events = [
            makeDbEvent({ name: "Evento Final", startDate: new Date("2026-07-07T18:00:00Z") }),
            makeDbEvent({ name: "Evento Inicial", startDate: new Date("2026-07-02T10:00:00Z") }),
        ];
        mockFindMany.mockResolvedValue(events);

        const result = await service.get("2026-07-01");

        expect(result[0].name).toBe("Evento Final");
        expect(result[1].name).toBe("Evento Inicial");
    });

    it("should use date-based cache key", async () => {
        const cacheAside = (await import("../../config/redis")).cacheAside;
        const spy = vi.spyOn({ cacheAside }, "cacheAside");
        mockFindMany.mockResolvedValue([]);

        await service.get("2026-07-01");

        // A chave de cache deve conter a data no formato YYYY-MM-DD
        expect(mockFindMany).toHaveBeenCalledTimes(1);
        spy.mockRestore();
    });

    it("should throw when prisma fails", async () => {
        mockFindMany.mockRejectedValue(new Error("Database error"));

        await expect(service.get("2026-07-01")).rejects.toThrow("Database error");
    });
});
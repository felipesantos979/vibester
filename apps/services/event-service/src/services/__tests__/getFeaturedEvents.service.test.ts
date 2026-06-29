import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetFeaturedEventsService } from "../getFeaturedEvents.service";

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
        isFeatured: true,
        startDate: new Date("2026-07-01T18:00:00Z"),
        totalConfirmed: 10,
        ticketLink: "https://example.com/tickets",
        ...overrides,
    };
}

describe("GetFeaturedEventsService", () => {
    let service: GetFeaturedEventsService;

    beforeEach(() => {
        service = new GetFeaturedEventsService();
        vi.clearAllMocks();
    });

    it("should return only featured events", async () => {
        const events = [
            makeDbEvent({ name: "Evento A" }),
            makeDbEvent({ id: "event-id-2", name: "Evento B" }),
        ];
        mockFindMany.mockResolvedValue(events);

        const result = await service.get();

        expect(mockFindMany).toHaveBeenCalledWith({
            where: { isFeatured: true },
            orderBy: { startDate: "asc" },
        });
        expect(result).toHaveLength(2);
        expect(result.every((e) => e.isFeatured)).toBe(true);
    });

    it("should return empty array when no featured events exist", async () => {
        mockFindMany.mockResolvedValue([]);

        const result = await service.get();

        expect(result).toEqual([]);
    });

    it("should return events ordered by startDate asc", async () => {
        const events = [
            makeDbEvent({ name: "Evento Futuro", startDate: new Date("2026-09-01T18:00:00Z") }),
            makeDbEvent({ name: "Evento Próximo", startDate: new Date("2026-07-01T18:00:00Z") }),
        ];
        mockFindMany.mockResolvedValue(events);

        const result = await service.get();

        expect(result[0].name).toBe("Evento Futuro");
        expect(result[1].name).toBe("Evento Próximo");
    });

    it("should return events with correct shape", async () => {
        const event = makeDbEvent({ ticketLink: null });
        mockFindMany.mockResolvedValue([event]);

        const result = await service.get();

        expect(result[0]).toMatchObject({
            id: event.id,
            name: event.name,
            isFeatured: true,
            ticketLink: null,
        });
    });

    it("should throw when prisma fails", async () => {
        mockFindMany.mockRejectedValue(new Error("Database error"));

        await expect(service.get()).rejects.toThrow("Database error");
    });
});
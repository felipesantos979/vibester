import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateEventService } from "../createEvent.service";
import { CreateEventInput } from "../../types/event.types";

vi.mock("../../config/redis", () => ({
    redis: { del: vi.fn().mockResolvedValue(1), keys: vi.fn().mockResolvedValue([]) },
    invalidateNearbyCache: vi.fn().mockResolvedValue(undefined),
}));

const { mockCreate } = vi.hoisted(() => ({
    mockCreate: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
    default: {
        event: {
            create: mockCreate,
        },
    },
}));

function makeEventInput(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    return {
        name: "Festival de Verão",
        photoUrl: "https://example.com/photo.jpg",
        category: "Música",
        organizer: "Organizer LTDA",
        location: "São Paulo, SP",
        startDate: "2026-07-01T18:00:00.000Z",
        endDate: "2026-07-01T23:00:00.000Z",
        ticketLink: "https://example.com/tickets",
        latitude: -23.5505,
        longitude: -46.6333,
        establishmentId: "550e8400-e29b-41d4-a716-446655440000",
        ...overrides,
    };
}

describe("CreateEventService", () => {
    let service: CreateEventService;

    beforeEach(() => {
        service = new CreateEventService();
        vi.clearAllMocks();
    });

    it("should create an event and return it", async () => {
        const input = makeEventInput();
        const createdEvent = {
            id: "event-id-1",
            ...input,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            totalConfirmed: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockCreate.mockResolvedValue(createdEvent);

        const result = await service.createEvent(input);

        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                ...input,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
            },
        });
        expect(result).toEqual(createdEvent);
    });

    it("should convert startDate and endDate strings to Date objects", async () => {
        const input = makeEventInput({
            startDate: "2026-08-15T10:00:00.000Z",
            endDate: "2026-08-15T22:00:00.000Z",
        });

        mockCreate.mockResolvedValue({ id: "event-id-2", ...input });

        await service.createEvent(input);

        const callArg = mockCreate.mock.calls[0][0].data;
        expect(callArg.startDate).toBeInstanceOf(Date);
        expect(callArg.endDate).toBeInstanceOf(Date);
    });

    it("should create event without ticketLink when not provided", async () => {
        const input = makeEventInput({ ticketLink: undefined });
        mockCreate.mockResolvedValue({ id: "event-id-3", ...input });

        await service.createEvent(input);

        const callArg = mockCreate.mock.calls[0][0].data;
        expect(callArg.ticketLink).toBeUndefined();
    });

    it("should throw when prisma fails", async () => {
        const input = makeEventInput();
        mockCreate.mockRejectedValue(new Error("Database error"));

        await expect(service.createEvent(input)).rejects.toThrow("Database error");
    });
});

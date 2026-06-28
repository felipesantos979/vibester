import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetEventsByEstablishmentService } from "../getEventsByEstablishment.service";

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

const ESTABLISHMENT_ID = "550e8400-e29b-41d4-a716-446655440000";

function makeDbEvent(overrides: Partial<{
  name: string;
  organizer: string;
  location: string;
  totalConfirmed: number;
  ticketLink: string | null;
}> = {}) {
  return {
    name: "Festival de Verão",
    organizer: "Organizer LTDA",
    location: "São Paulo, SP",
    totalConfirmed: 10,
    ticketLink: "https://example.com/tickets",
    ...overrides,
  };
}

describe("GetEventsByEstablishmentService", () => {
  let service: GetEventsByEstablishmentService;

  beforeEach(() => {
    service = new GetEventsByEstablishmentService();
    vi.clearAllMocks();
  });

  it("should return all events for an establishment", async () => {
    const events = [makeDbEvent({ name: "Evento A" }), makeDbEvent({ name: "Evento B" })];
    mockFindMany.mockResolvedValue(events);

    const result = await service.get(ESTABLISHMENT_ID);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { establishmentId: ESTABLISHMENT_ID },
      select: {
        name: true,
        organizer: true,
        location: true,
        totalConfirmed: true,
        ticketLink: true,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Evento A");
    expect(result[1].name).toBe("Evento B");
  });

  it("should return empty array when establishment has no events", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await service.get(ESTABLISHMENT_ID);

    expect(result).toEqual([]);
  });

  it("should return events with correct shape", async () => {
    const event = makeDbEvent({ ticketLink: null });
    mockFindMany.mockResolvedValue([event]);

    const result = await service.get(ESTABLISHMENT_ID);

    expect(result[0]).toEqual({
      name: event.name,
      organizer: event.organizer,
      location: event.location,
      totalConfirmed: event.totalConfirmed,
      ticketLink: null,
    });
  });

  it("should throw when prisma fails", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    await expect(service.get(ESTABLISHMENT_ID)).rejects.toThrow("Database error");
  });
});

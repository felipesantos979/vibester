import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetEventDetailsService } from "../getEventDetails.service";

const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
  default: {
    event: {
      findUnique: mockFindUnique,
    },
  },
}));

function makeDbEvent(overrides: Partial<{
  id: string;
  name: string;
  organizer: string;
  location: string;
  totalConfirmed: number;
  ticketLink: string | null;
}> = {}) {
  return {
    id: "event-id-1",
    name: "Festival de Verão",
    organizer: "Organizer LTDA",
    location: "São Paulo, SP",
    totalConfirmed: 42,
    ticketLink: "https://example.com/tickets",
    ...overrides,
  };
}

describe("GetEventDetailsService", () => {
  let service: GetEventDetailsService;

  beforeEach(() => {
    service = new GetEventDetailsService();
    vi.clearAllMocks();
  });

  it("should return event details when event exists", async () => {
    const event = makeDbEvent();
    mockFindUnique.mockResolvedValue(event);

    const result = await service.get("event-id-1");

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "event-id-1" } });
    expect(result).toEqual({
      name: event.name,
      organizer: event.organizer,
      location: event.location,
      totalConfirmed: event.totalConfirmed,
      ticketLink: event.ticketLink,
    });
  });

  it("should return ticketLink as null when not set", async () => {
    const event = makeDbEvent({ ticketLink: null });
    mockFindUnique.mockResolvedValue(event);

    const result = await service.get("event-id-1");

    expect(result.ticketLink).toBeNull();
  });

  it("should throw when event is not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(service.get("non-existent-id")).rejects.toThrow("Evento não encontrado");
  });

  it("should throw when prisma fails", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    await expect(service.get("event-id-1")).rejects.toThrow("Database error");
  });
});

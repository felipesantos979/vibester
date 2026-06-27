import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListEventsService, calculateDistance } from "../listEvents.service";

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
  photoUrl: string;
  name: string;
  location: string;
  startDate: Date;
  totalConfirmed: number;
  latitude: number;
  longitude: number;
}> = {}) {
  return {
    photoUrl: "https://example.com/photo.jpg",
    name: "Evento Teste",
    location: "São Paulo, SP",
    startDate: new Date("2026-07-01T18:00:00Z"),
    totalConfirmed: 10,
    latitude: -23.5505,
    longitude: -46.6333,
    ...overrides,
  };
}

describe("calculateDistance", () => {
  it("should return 0 for the same coordinates", () => {
    const distance = calculateDistance(-23.5505, -46.6333, -23.5505, -46.6333);
    expect(distance).toBe(0);
  });

  it("should calculate approximate distance between two points", () => {
    // São Paulo to Rio de Janeiro (~357 km)
    const distance = calculateDistance(-23.5505, -46.6333, -22.9068, -43.1729);
    expect(distance).toBeGreaterThan(300);
    expect(distance).toBeLessThan(400);
  });
});

describe("ListEventsService", () => {
  let service: ListEventsService;

  beforeEach(() => {
    service = new ListEventsService();
    vi.clearAllMocks();
  });

  it("should return events within the default radius (10km)", async () => {
    const nearEvent = makeDbEvent({ latitude: -23.5505, longitude: -46.6333 });
    const farEvent = makeDbEvent({ name: "Evento Distante", latitude: -22.9068, longitude: -43.1729 });

    mockFindMany.mockResolvedValue([nearEvent, farEvent]);

    const result = await service.listEvents({ latitude: -23.5505, longitude: -46.6333 });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Evento Teste");
  });

  it("should return events ordered by distance", async () => {
    const closeEvent = makeDbEvent({ name: "Perto", latitude: -23.5510, longitude: -46.6340 });
    const midEvent = makeDbEvent({ name: "Médio", latitude: -23.5600, longitude: -46.6400 });

    mockFindMany.mockResolvedValue([midEvent, closeEvent]);

    const result = await service.listEvents({
      latitude: -23.5505,
      longitude: -46.6333,
      radiusKm: 10,
    });

    expect(result[0].name).toBe("Perto");
    expect(result[1].name).toBe("Médio");
  });

  it("should attach distanceKm to each event", async () => {
    const event = makeDbEvent();
    mockFindMany.mockResolvedValue([event]);

    const result = await service.listEvents({ latitude: -23.5505, longitude: -46.6333 });

    expect(result[0]).toHaveProperty("distanceKm");
    expect(typeof result[0].distanceKm).toBe("number");
  });

  it("should use custom radiusKm", async () => {
    const nearEvent = makeDbEvent({ latitude: -23.5505, longitude: -46.6333 });
    const farEvent = makeDbEvent({ name: "Distante", latitude: -22.9068, longitude: -43.1729 });

    mockFindMany.mockResolvedValue([nearEvent, farEvent]);

    const result = await service.listEvents({
      latitude: -23.5505,
      longitude: -46.6333,
      radiusKm: 500,
    });

    expect(result).toHaveLength(2);
  });

  it("should return empty array when no events within radius", async () => {
    const farEvent = makeDbEvent({ latitude: -22.9068, longitude: -43.1729 });
    mockFindMany.mockResolvedValue([farEvent]);

    const result = await service.listEvents({ latitude: -23.5505, longitude: -46.6333, radiusKm: 5 });

    expect(result).toHaveLength(0);
  });

  it("should throw when prisma fails", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    await expect(
      service.listEvents({ latitude: -23.5505, longitude: -46.6333 })
    ).rejects.toThrow("Database error");
  });
});

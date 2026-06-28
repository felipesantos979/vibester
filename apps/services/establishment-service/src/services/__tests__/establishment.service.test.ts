import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock prismaClient before importing the service ──────────────────────────
const { mockFindMany, mockFindUnique, mockUpdate } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
  default: {
    establishment: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

import {
  calculateDistance,
  EstablishmentService,
} from "../establishment.service";

// ── Helpers ─────────────────────────────────────────────────────────────────
function makeEstablishment(overrides: Record<string, unknown> = {}) {
  return {
    id: "est-1",
    googlePlaceId: null,
    name: "Bar do Zé",
    photoUrl: "https://img.test/photo.jpg",
    bannerUrl: "https://img.test/banner.jpg",
    category: "bar",
    priceIndicator: "$$",
    averageRating: 4.5,
    latitude: -23.5505,
    longitude: -46.6333,
    movementLevel: null,
    openingHours: [],
    ...overrides,
  };
}

// ── calculateDistance (pure function) ────────────────────────────────────────
describe("calculateDistance", () => {
  it("returns 0 for the same point", () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
    expect(calculateDistance(-23.55, -46.63, -23.55, -46.63)).toBe(0);
  });

  it("calculates the correct approximate distance between two known points", () => {
    // São Paulo → Rio de Janeiro ≈ 357 km (straight-line Haversine)
    const spLat = -23.5505;
    const spLon = -46.6333;
    const rjLat = -22.9068;
    const rjLon = -43.1729;

    const distance = calculateDistance(spLat, spLon, rjLat, rjLon);
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(365);
  });
});

// ── listOpenEstablishments ──────────────────────────────────────────────────
describe("EstablishmentService.listOpenEstablishments", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns an establishment that is currently open (normal hours)", async () => {
    // Wednesday (day 3), 15:00
    vi.setSystemTime(new Date(2026, 5, 17, 15, 0, 0)); // June 17, 2026 = Wednesday

    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({
        openingHours: [{ dayOfWeek: 3, openTime: "10:00", closeTime: "22:00" }],
      }),
    ]);

    const result = await EstablishmentService.listOpenEstablishments();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("est-1");
  });

  it("excludes an establishment that is currently closed (normal hours)", async () => {
    // Wednesday (day 3), 23:00 — after close
    vi.setSystemTime(new Date(2026, 5, 17, 23, 0, 0));

    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({
        openingHours: [{ dayOfWeek: 3, openTime: "10:00", closeTime: "22:00" }],
      }),
    ]);

    const result = await EstablishmentService.listOpenEstablishments();
    expect(result).toHaveLength(0);
  });

  it("handles hours that cross midnight — open on the opening day side", async () => {
    // Saturday (day 6), 23:30 — should be open (opens 22:00 Sat, closes 02:00 Sun)
    vi.setSystemTime(new Date(2026, 5, 20, 23, 30, 0)); // June 20, 2026 = Saturday

    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({
        openingHours: [{ dayOfWeek: 6, openTime: "22:00", closeTime: "02:00" }],
      }),
    ]);

    const result = await EstablishmentService.listOpenEstablishments();
    expect(result).toHaveLength(1);
  });

  it("handles hours that cross midnight — open on the next day (closing) side", async () => {
    // Sunday (day 0), 01:00 — still within Sat 22:00–02:00 window
    vi.setSystemTime(new Date(2026, 5, 21, 1, 0, 0)); // June 21, 2026 = Sunday

    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({
        openingHours: [{ dayOfWeek: 6, openTime: "22:00", closeTime: "02:00" }],
      }),
    ]);

    const result = await EstablishmentService.listOpenEstablishments();
    expect(result).toHaveLength(1);
  });

  it("handles hours that cross midnight — closed well past closing time", async () => {
    // Sunday (day 0), 03:00 — past the 02:00 close
    vi.setSystemTime(new Date(2026, 5, 21, 3, 0, 0));

    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({
        openingHours: [{ dayOfWeek: 6, openTime: "22:00", closeTime: "02:00" }],
      }),
    ]);

    const result = await EstablishmentService.listOpenEstablishments();
    expect(result).toHaveLength(0);
  });
});

// ── listEstablishments ──────────────────────────────────────────────────────
describe("EstablishmentService.listEstablishments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies category filter", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await EstablishmentService.listEstablishments({ category: "bar" });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        category: { equals: "bar", mode: "insensitive" },
      }),
    });
  });

  it("applies minRating filter", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await EstablishmentService.listEstablishments({ minRating: 4 });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        averageRating: { gte: 4 },
      }),
    });
  });

  it("applies search filter", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await EstablishmentService.listEstablishments({ search: "cerveja" });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        name: { contains: "cerveja", mode: "insensitive" },
      }),
    });
  });

  it("sorts by name", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({ name: "Zebra" }),
      makeEstablishment({ id: "est-2", name: "Alpha" }),
    ]);

    const result = await EstablishmentService.listEstablishments({
      sortBy: "name",
    });

    expect(result[0].name).toBe("Alpha");
    expect(result[1].name).toBe("Zebra");
  });

  it("sorts by rating (descending)", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({ averageRating: 3.0 }),
      makeEstablishment({ id: "est-2", averageRating: 5.0 }),
    ]);

    const result = await EstablishmentService.listEstablishments({
      sortBy: "rating",
    });

    expect(result[0].averageRating).toBe(5.0);
    expect(result[1].averageRating).toBe(3.0);
  });

  it("sorts by distance when coordinates are provided", async () => {
    mockFindMany.mockResolvedValueOnce([
      makeEstablishment({ latitude: -22.9068, longitude: -43.1729 }), // Rio (far)
      makeEstablishment({
        id: "est-2",
        latitude: -23.5489,
        longitude: -46.6388,
      }), // SP (close)
    ]);

    const result = await EstablishmentService.listEstablishments({
      sortBy: "distance",
      userLat: -23.5505,
      userLon: -46.6333,
    });

    expect(result[0].id).toBe("est-2"); // closer point first
  });

  it("throws when sortBy=distance without coordinates", async () => {
    await expect(
      EstablishmentService.listEstablishments({ sortBy: "distance" })
    ).rejects.toThrow(
      "Latitude and longitude are required to sort by distance"
    );
  });
});

// ── updateRating ────────────────────────────────────────────────────────────
describe("EstablishmentService.updateRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws INVALID_RATING for a negative value", async () => {
    await expect(
      EstablishmentService.updateRating("est-1", -1)
    ).rejects.toThrow("INVALID_RATING");
  });

  it("throws INVALID_RATING for a value greater than 5", async () => {
    await expect(
      EstablishmentService.updateRating("est-1", 5.1)
    ).rejects.toThrow("INVALID_RATING");
  });

  it("throws ESTABLISHMENT_NOT_FOUND when the id doesn't exist", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    await expect(
      EstablishmentService.updateRating("nonexistent", 4)
    ).rejects.toThrow("ESTABLISHMENT_NOT_FOUND");
  });

  it("updates the rating successfully", async () => {
    const establishment = makeEstablishment();
    mockFindUnique.mockResolvedValueOnce(establishment);
    mockUpdate.mockResolvedValueOnce({ ...establishment, averageRating: 4.8 });

    const result = await EstablishmentService.updateRating("est-1", 4.8);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "est-1" },
      data: {
            averageRating: 4.8,
            qtdAvaliacoes: { increment: 1 },
        },
    });
    expect(result.averageRating).toBe(4.8);
  });
});

// ── getEstablishmentProfile ─────────────────────────────────────────────────
describe("EstablishmentService.getEstablishmentProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the establishment is not found", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    await expect(
      EstablishmentService.getEstablishmentProfile("nonexistent")
    ).rejects.toThrow("Establishment not found");
  });

  it("maps database fields to the profile response correctly", async () => {
    mockFindUnique.mockResolvedValueOnce(
      makeEstablishment({
        id: "est-99",
        name: "Pub London",
        photoUrl: "https://img.test/icon.jpg",
        bannerUrl: "https://img.test/banner.jpg",
        latitude: -23.55,
        longitude: -46.63,
        category: "pub",
        priceIndicator: "$$$",
        averageRating: 4.2,
      })
    );

    const profile =
      await EstablishmentService.getEstablishmentProfile("est-99");

    expect(profile).toEqual({
      icon: "https://img.test/icon.jpg",
      name: "Pub London",
      banner: "https://img.test/banner.jpg",
      location: { latitude: -23.55, longitude: -46.63 },
      category: "pub",
      priceIndicator: "$$$",
      rating: 4.2,
    });
  });
});

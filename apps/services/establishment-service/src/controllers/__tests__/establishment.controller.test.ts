import { describe, it, expect, vi, beforeEach } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";

const { mockListEstablishments, mockUpdateRating, mockGetProfile, mockListOpen } = vi.hoisted(() => ({
  mockListEstablishments: vi.fn(),
  mockUpdateRating: vi.fn(),
  mockGetProfile: vi.fn(),
  mockListOpen: vi.fn(),
}));

vi.mock("../../services/establishment.service", () => ({
  EstablishmentService: {
    listEstablishments: mockListEstablishments,
    updateRating: mockUpdateRating,
    getEstablishmentProfile: mockGetProfile,
    listOpenEstablishments: mockListOpen,
  },
}));

vi.mock("../../services/upload.service", () => ({
  UploadService: {
    uploadProfilePicture: vi.fn(),
  },
}));

import {
  listEstablishmentsController,
  updateEstablishmentRatingController,
  getEstablishmentProfileController,
  listOpenEstablishmentsController,
} from "../establishment.controller";

function makeReply() {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
  return reply;
}

function makeRequest(overrides: Partial<FastifyRequest> = {}): FastifyRequest {
  return {
    query: {},
    params: {},
    body: {},
    ...overrides,
  } as FastifyRequest;
}

// ── listEstablishmentsController ─────────────────────────────────────────────

describe("listEstablishmentsController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with establishments on success", async () => {
    const establishments = [{ id: "est-1", name: "Bar do Zé" }];
    mockListEstablishments.mockResolvedValueOnce(establishments);

    const req = makeRequest({ query: {} } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(establishments);
  });

  it("returns 400 when only latitude is provided without longitude", async () => {
    const req = makeRequest({ query: { latitude: "-23.55" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Latitude and longitude must be provided together",
    });
  });

  it("returns 400 when only longitude is provided without latitude", async () => {
    const req = makeRequest({ query: { longitude: "-46.63" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when latitude is not a valid number", async () => {
    const req = makeRequest({ query: { latitude: "abc", longitude: "-46.63" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid latitude or longitude format",
    });
  });

  it("returns 400 when minRating is above 5", async () => {
    const req = makeRequest({ query: { minRating: "6" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid minRating. Must be a number between 0 and 5.",
    });
  });

  it("returns 400 when minRating is negative", async () => {
    const req = makeRequest({ query: { minRating: "-1" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when sortBy=distance is requested without coordinates", async () => {
    mockListEstablishments.mockRejectedValueOnce(
      new Error("Latitude and longitude are required to sort by distance")
    );

    const req = makeRequest({ query: { sortBy: "distance" } } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Latitude and longitude are required to sort by distance",
    });
  });

  it("returns 500 on unexpected service error", async () => {
    mockListEstablishments.mockRejectedValueOnce(new Error("DB error"));

    const req = makeRequest({ query: {} } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
  });

  it("passes parsed coordinates and filters to the service", async () => {
    mockListEstablishments.mockResolvedValueOnce([]);

    const req = makeRequest({
      query: {
        latitude: "-23.55",
        longitude: "-46.63",
        category: "bar",
        minRating: "4",
        search: "cerveja",
        sortBy: "distance",
      },
    } as any);
    const reply = makeReply();

    await listEstablishmentsController(req as any, reply);

    expect(mockListEstablishments).toHaveBeenCalledWith({
      userLat: -23.55,
      userLon: -46.63,
      category: "bar",
      minRating: 4,
      search: "cerveja",
      sortBy: "distance",
    });
  });
});

// ── updateEstablishmentRatingController ──────────────────────────────────────

describe("updateEstablishmentRatingController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with updated establishment on success", async () => {
    const updated = { id: "est-1", averageRating: 4.8 };
    mockUpdateRating.mockResolvedValueOnce(updated);

    const req = makeRequest({ params: { id: "est-1" }, body: { rating: 4.8 } } as any);
    const reply = makeReply();

    await updateEstablishmentRatingController(req as any, reply);

    expect(mockUpdateRating).toHaveBeenCalledWith("est-1", 4.8);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(updated);
  });

  it("returns 404 when establishment is not found", async () => {
    mockUpdateRating.mockRejectedValueOnce(new Error("ESTABLISHMENT_NOT_FOUND"));

    const req = makeRequest({ params: { id: "nonexistent" }, body: { rating: 4 } } as any);
    const reply = makeReply();

    await updateEstablishmentRatingController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Estabelecimento não encontrado" });
  });

  it("returns 400 for invalid rating value", async () => {
    mockUpdateRating.mockRejectedValueOnce(new Error("INVALID_RATING"));

    const req = makeRequest({ params: { id: "est-1" }, body: { rating: 10 } } as any);
    const reply = makeReply();

    await updateEstablishmentRatingController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({ message: "Avaliação deve estar entre 0 e 5" });
  });

  it("returns 500 on unexpected error", async () => {
    mockUpdateRating.mockRejectedValueOnce(new Error("DB connection lost"));

    const req = makeRequest({ params: { id: "est-1" }, body: { rating: 4 } } as any);
    const reply = makeReply();

    await updateEstablishmentRatingController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
  });
});

// ── getEstablishmentProfileController ────────────────────────────────────────

describe("getEstablishmentProfileController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with profile on success", async () => {
    const profile = { name: "Bar do Zé", rating: 4.5 };
    mockGetProfile.mockResolvedValueOnce(profile);

    const req = makeRequest({ params: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } } as any);
    const reply = makeReply();

    await getEstablishmentProfileController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(profile);
  });

  it("returns 400 when id is not a valid UUID", async () => {
    const req = makeRequest({ params: { id: "not-a-uuid" } } as any);
    const reply = makeReply();

    await getEstablishmentProfileController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({ message: "Invalid establishment ID" });
  });

  it("returns 404 when establishment is not found", async () => {
    mockGetProfile.mockRejectedValueOnce(new Error("Establishment not found"));

    const req = makeRequest({ params: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } } as any);
    const reply = makeReply();

    await getEstablishmentProfileController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
  });

  it("returns 500 on unexpected error", async () => {
    mockGetProfile.mockRejectedValueOnce(new Error("unexpected"));

    const req = makeRequest({ params: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6" } } as any);
    const reply = makeReply();

    await getEstablishmentProfileController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
  });
});

// ── listOpenEstablishmentsController ─────────────────────────────────────────

describe("listOpenEstablishmentsController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with open establishments", async () => {
    const open = [{ id: "est-1" }];
    mockListOpen.mockResolvedValueOnce(open);

    const req = makeRequest();
    const reply = makeReply();

    await listOpenEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(open);
  });

  it("returns 500 on service error", async () => {
    mockListOpen.mockRejectedValueOnce(new Error("DB error"));

    const req = makeRequest();
    const reply = makeReply();

    await listOpenEstablishmentsController(req as any, reply);

    expect(reply.status).toHaveBeenCalledWith(500);
  });
});

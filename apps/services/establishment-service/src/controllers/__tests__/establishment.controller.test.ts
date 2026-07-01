import { describe, it, expect, vi, beforeEach } from "vitest";
import { FastifyReply, FastifyRequest } from "fastify";
import { Readable } from "stream";

const { mockListEstablishments, mockUpdateRating, mockGetProfile, mockListOpen, mockUpdateMovementLevel } = vi.hoisted(
  () => ({
    mockListEstablishments: vi.fn(),
    mockUpdateRating: vi.fn(),
    mockGetProfile: vi.fn(),
    mockListOpen: vi.fn(),
    mockUpdateMovementLevel: vi.fn(),
  })
);

vi.mock("../../services/establishment.service", () => ({
  EstablishmentService: {
    listEstablishments: mockListEstablishments,
    updateRating: mockUpdateRating,
    getEstablishmentProfile: mockGetProfile,
    listOpenEstablishments: mockListOpen,
    updateMovementLevel: mockUpdateMovementLevel,
  },
}));

vi.mock("../../services/upload.service", () => ({
  UploadService: {
    uploadProfilePicture: vi.fn(),
  },
}));

const { mockListNearby } = vi.hoisted(() => ({
  mockListNearby: vi.fn(),
}));

vi.mock("../../services/listEstablishment.service", () => ({
  ListEstablishmentsService: class {
    listEstablishments = mockListNearby;
  },
}));

const { mockCacheAside } = vi.hoisted(() => ({
  mockCacheAside: vi.fn((_key: string, _ttl: number, fetchFn: () => unknown) => fetchFn()),
}));

vi.mock("../../config/redis", () => ({
  cacheAside: mockCacheAside,
  nearbyEstablishmentKey: vi.fn(() => "nearby:key"),
}));

import {
  listEstablishmentsController,
  updateEstablishmentRatingController,
  getEstablishmentProfileController,
  listOpenEstablishmentsController,
  updateMovementLevelController,
  listNearbyEstablishmentsController,
  uploadProfilePictureController,
} from "../establishment.controller";
import { UploadService } from "../../services/upload.service";

function makeReply() {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
  return reply;
}

function makeRequest(overrides: Record<string, unknown> = {}): any {
  return { query: {}, params: {}, body: {}, ...overrides };
}

const VALID_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5";

function makePaginatedResult(data: unknown[] = []) {
  return {
    data,
    pagination: { total: data.length, page: 1, limit: 20, totalPages: 1 },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── listEstablishmentsController ─────────────────────────────────────────────
describe("listEstablishmentsController", () => {
  it("retorna 200 com resultado paginado", async () => {
    const paginated = makePaginatedResult([{ id: "1", name: "Bar" }]);
    mockListEstablishments.mockResolvedValue(paginated);

    const reply = makeReply();
    await listEstablishmentsController(makeRequest(), reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(paginated);
  });

  it("retorna 400 quando apenas latitude fornecida", async () => {
    const reply = makeReply();
    await listEstablishmentsController(
      makeRequest({ query: { latitude: "-23.5" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 para coordenadas inválidas", async () => {
    const reply = makeReply();
    await listEstablishmentsController(
      makeRequest({
        query: { latitude: "abc", longitude: "-46.6" },
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 para minRating fora do intervalo", async () => {
    const reply = makeReply();
    await listEstablishmentsController(
      makeRequest({ query: { minRating: "6" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 para page inválida", async () => {
    const reply = makeReply();
    await listEstablishmentsController(
      makeRequest({ query: { page: "0" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 para limit acima de 100", async () => {
    const reply = makeReply();
    await listEstablishmentsController(
      makeRequest({ query: { limit: "200" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 400 quando service lança erro de distância", async () => {
    mockListEstablishments.mockRejectedValue(
      new Error("Latitude and longitude are required to sort by distance")
    );

    const reply = makeReply();
    await listEstablishmentsController(makeRequest(), reply);

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 500 em erro inesperado", async () => {
    mockListEstablishments.mockRejectedValue(new Error("DB error"));

    const reply = makeReply();
    await listEstablishmentsController(makeRequest(), reply);

    expect(reply.status).toHaveBeenCalledWith(500);
  });
});

describe("updateEstablishmentRatingController", () => {
  it("retorna 200 ao atualizar com sucesso", async () => {
    const updated = { id: "1", averageRating: 4.5 };
    mockUpdateRating.mockResolvedValue(updated);

    const reply = makeReply();
    await updateEstablishmentRatingController(
      makeRequest({ params: { id: "1" }, body: { rating: 4.5 } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(updated);
  });

  it("retorna 404 quando ESTABLISHMENT_NOT_FOUND", async () => {
    mockUpdateRating.mockRejectedValue(new Error("ESTABLISHMENT_NOT_FOUND"));

    const reply = makeReply();
    await updateEstablishmentRatingController(
      makeRequest({ params: { id: "x" }, body: { rating: 4 } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(404);
  });

  it("retorna 400 quando INVALID_RATING", async () => {
    mockUpdateRating.mockRejectedValue(new Error("INVALID_RATING"));

    const reply = makeReply();
    await updateEstablishmentRatingController(
      makeRequest({ params: { id: "1" }, body: { rating: 10 } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 500 e loga erro em falha inesperada", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUpdateRating.mockRejectedValue(new Error("unexpected"));

    const reply = makeReply();
    await updateEstablishmentRatingController(
      makeRequest({ params: { id: "1" }, body: { rating: 4 } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe("getEstablishmentProfileController", () => {
  const VALID_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5";

  it("retorna 200 com perfil encontrado", async () => {
    const profile = { id: VALID_UUID, name: "Bar" };
    mockGetProfile.mockResolvedValue(profile);

    const reply = makeReply();
    await getEstablishmentProfileController(
      makeRequest({ params: { id: VALID_UUID } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(profile);
  });

  it("retorna 400 para ID não-UUID", async () => {
    const reply = makeReply();
    await getEstablishmentProfileController(
      makeRequest({ params: { id: "not-a-uuid" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 404 quando não encontrado", async () => {
    mockGetProfile.mockRejectedValue(new Error("Establishment not found"));

    const reply = makeReply();
    await getEstablishmentProfileController(
      makeRequest({ params: { id: VALID_UUID } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(404);
  });

  it("retorna 500 e loga erro em falha inesperada", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetProfile.mockRejectedValue(new Error("unexpected"));

    const reply = makeReply();
    await getEstablishmentProfileController(
      makeRequest({ params: { id: VALID_UUID } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe("listOpenEstablishmentsController", () => {
  it("retorna 200 com lista", async () => {
    mockListOpen.mockResolvedValue([{ id: "1" }]);

    const reply = makeReply();
    await listOpenEstablishmentsController(makeRequest(), reply);

    expect(reply.status).toHaveBeenCalledWith(200);
  });

  it("retorna 500 e loga erro em falha", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockListOpen.mockRejectedValue(new Error("DB error"));

    const reply = makeReply();
    await listOpenEstablishmentsController(makeRequest(), reply);

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

// ── updateMovementLevelController ────────────────────────────────────────────
describe("updateMovementLevelController", () => {
  it("retorna 204 ao atualizar com sucesso", async () => {
    mockUpdateMovementLevel.mockResolvedValue(undefined);

    const reply = makeReply();
    await updateMovementLevelController(
      makeRequest({ params: { id: VALID_UUID }, body: { level: "HIGH" } }),
      reply
    );

    expect(mockUpdateMovementLevel).toHaveBeenCalledWith(VALID_UUID, "HIGH");
    expect(reply.status).toHaveBeenCalledWith(204);
  });

  it("retorna 404 quando o estabelecimento não existe (P2025)", async () => {
    const error = Object.assign(new Error("Not found"), { code: "P2025" });
    mockUpdateMovementLevel.mockRejectedValue(error);

    const reply = makeReply();
    await updateMovementLevelController(
      makeRequest({ params: { id: VALID_UUID }, body: { level: "LOW" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(404);
  });

  it("retorna 500 e loga erro em falha inesperada", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUpdateMovementLevel.mockRejectedValue(new Error("unexpected"));

    const reply = makeReply();
    await updateMovementLevelController(
      makeRequest({ params: { id: VALID_UUID }, body: { level: "LOW" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

// ── listNearbyEstablishmentsController ───────────────────────────────────────
describe("listNearbyEstablishmentsController", () => {
  it("retorna 200 com estabelecimentos próximos usando cache-aside", async () => {
    mockListNearby.mockResolvedValue([{ id: "1", distanceTo: 1.2 }]);

    const reply = makeReply();
    await listNearbyEstablishmentsController(
      makeRequest({ query: { latitude: "-23.5", longitude: "-46.6" } }),
      reply
    );

    expect(mockCacheAside).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith([{ id: "1", distanceTo: 1.2 }]);
  });

  it("usa radiusKm padrão de 10km quando não fornecido", async () => {
    mockListNearby.mockResolvedValue([]);

    const reply = makeReply();
    await listNearbyEstablishmentsController(
      makeRequest({ query: { latitude: "-23.5", longitude: "-46.6" } }),
      reply
    );

    expect(mockListNearby).toHaveBeenCalledWith(
      expect.objectContaining({ radiusKm: 10 })
    );
  });

  it("retorna 400 quando latitude não é um número válido", async () => {
    const reply = makeReply();
    await listNearbyEstablishmentsController(
      makeRequest({ query: { latitude: "abc", longitude: "-46.6" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(mockListNearby).not.toHaveBeenCalled();
  });

  it("retorna 400 quando radiusKm não é um número válido", async () => {
    const reply = makeReply();
    await listNearbyEstablishmentsController(
      makeRequest({ query: { latitude: "-23.5", longitude: "-46.6", radiusKm: "xyz" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(400);
  });

  it("retorna 500 e loga erro quando o serviço falha", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockListNearby.mockRejectedValue(new Error("DB error"));

    const reply = makeReply();
    await listNearbyEstablishmentsController(
      makeRequest({ query: { latitude: "-23.5", longitude: "-46.6" } }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

// ── uploadProfilePictureController ───────────────────────────────────────────
describe("uploadProfilePictureController", () => {
  function makeUploadRequest(part: { mimetype: string; file: unknown } | undefined) {
    return {
      params: { id: VALID_UUID },
      file: vi.fn().mockResolvedValue(part),
    } as unknown as FastifyRequest<{ Params: { id: string } }>;
  }

  it("retorna 400 quando nenhum arquivo é enviado", async () => {
    const reply = makeReply();
    await uploadProfilePictureController(makeUploadRequest(undefined), reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(UploadService.uploadProfilePicture).not.toHaveBeenCalled();
  });

  it("retorna 400 para formato de arquivo não permitido", async () => {
    const resume = vi.fn();
    const reply = makeReply();
    await uploadProfilePictureController(
      makeUploadRequest({ mimetype: "application/pdf", file: { resume } }),
      reply
    );

    expect(resume).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(UploadService.uploadProfilePicture).not.toHaveBeenCalled();
  });

  it("faz upload com sucesso e retorna 200 com a photoUrl", async () => {
    const fileStream = Readable.from([Buffer.from("fake-image")]);
    vi.mocked(UploadService.uploadProfilePicture).mockResolvedValue(
      "https://test.r2.dev/establishments/1/profile/uuid"
    );

    const reply = makeReply();
    await uploadProfilePictureController(
      makeUploadRequest({ mimetype: "image/png", file: fileStream }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      photoUrl: "https://test.r2.dev/establishments/1/profile/uuid",
    });
  });

  it("retorna 404 quando o estabelecimento não existe (P2025)", async () => {
    const fileStream = Readable.from([Buffer.from("fake-image")]);
    const error = Object.assign(new Error("Not found"), { code: "P2025" });
    vi.mocked(UploadService.uploadProfilePicture).mockRejectedValue(error);

    const reply = makeReply();
    await uploadProfilePictureController(
      makeUploadRequest({ mimetype: "image/png", file: fileStream }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(404);
  });

  it("retorna 500 e loga erro em falha inesperada no upload", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const fileStream = Readable.from([Buffer.from("fake-image")]);
    vi.mocked(UploadService.uploadProfilePicture).mockRejectedValue(new Error("R2 down"));

    const reply = makeReply();
    await uploadProfilePictureController(
      makeUploadRequest({ mimetype: "image/png", file: fileStream }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(500);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

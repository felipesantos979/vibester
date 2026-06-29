import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
const { mockEstablishment } = vi.hoisted(() => ({
  mockEstablishment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  },
}));

vi.mock("../../src/prisma/index", () => ({
  default: {
    establishment: mockEstablishment,
    $queryRaw: mockEstablishment.$queryRaw,
    $transaction: mockEstablishment.$transaction,
  },
}));

import { buildServer } from "../helpers/fastify.test.helper";
import { redis } from "../../src/config/redis";

const ESTAB_ID = "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5";
const OTHER_ID = "b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5";

function makeEstablishment(overrides: Record<string, unknown> = {}) {
  return {
    id: ESTAB_ID,
    googlePlaceId: "ChIJ123",
    name: "Bar do Zé",
    bio: null,
    endereco: "Rua Test, 123",
    photoUrl: "https://example.com/photo.jpg",
    bannerUrl: "https://example.com/banner.jpg",
    category: "bar",
    priceIndicator: "$$",
    averageRating: 4.5,
    qtdAvaliacoes: 10,
    distribuicao: [0, 0, 1, 4, 5],
    nivelMovimento: 3,
    latitude: -23.5,
    longitude: -46.6,
    openingHours: [],
    movementLevel: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    ...overrides,
  };
}

describe("establishment-service — HTTP Integration (Redis real, Prisma mockado)", () => {
  let app: Awaited<ReturnType<typeof buildServer>>;
  let authToken: string;

  beforeAll(async () => {
    app = await buildServer();
    authToken = app.jwt.sign({ sub: "integration-test-service" });
    await redis.connect().catch(() => {});
  });

  afterAll(async () => {
    await app.close();
    await redis.quit().catch(() => {});
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await redis.flushall();
    mockEstablishment.$transaction.mockImplementation(
      (fn: (tx: unknown) => Promise<unknown>) =>
        fn({ establishment: mockEstablishment })
    );
  });


  describe("GET /health", () => {
    it("retorna 200 ok (liveness)", async () => {
      const res = await app.inject({ method: "GET", url: "/health" });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ status: "ok" });
    });
  });


  describe("GET /establishments", () => {
    it("retorna lista paginada sem filtros", async () => {
      mockEstablishment.count.mockResolvedValue(1);
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({ method: "GET", url: "/establishments" });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("pagination");
      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toHaveProperty("name", "Bar do Zé");
      expect(body.pagination).toMatchObject({ page: 1, limit: 20 });
    });

    it("filtra por categoria", async () => {
      mockEstablishment.count.mockResolvedValue(1);
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({
        method: "GET",
        url: "/establishments?category=bar",
      });

      expect(res.statusCode).toBe(200);
      expect(mockEstablishment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: expect.objectContaining({ equals: "bar" }),
          }),
        })
      );
    });

    it("filtra por minRating", async () => {
      mockEstablishment.count.mockResolvedValue(0);
      mockEstablishment.findMany.mockResolvedValue([]);

      const res = await app.inject({
        method: "GET",
        url: "/establishments?minRating=4.0",
      });

      expect(res.statusCode).toBe(200);
      expect(mockEstablishment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            averageRating: expect.objectContaining({ gte: 4.0 }),
          }),
        })
      );
    });

    it("ordena por distância usando bounding box quando coordenadas são fornecidas", async () => {
      const close = makeEstablishment({ latitude: -23.5, longitude: -46.6, name: "Perto" });
      const far = makeEstablishment({
        id: OTHER_ID,
        latitude: -24.0,
        longitude: -47.0,
        name: "Longe",
      });
      mockEstablishment.findMany.mockResolvedValue([far, close]);

      const res = await app.inject({
        method: "GET",
        url: "/establishments?latitude=-23.5&longitude=-46.6",
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.data[0].name).toBe("Perto");
    });

    it("aplica paginação corretamente", async () => {
      mockEstablishment.count.mockResolvedValue(50);
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({
        method: "GET",
        url: "/establishments?page=2&limit=10",
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.pagination).toMatchObject({
        page: 2,
        limit: 10,
        total: 50,
        totalPages: 5,
      });
      expect(mockEstablishment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10, skip: 10 })
      );
    });

    it("retorna 400 se apenas latitude fornecida sem longitude", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/establishments?latitude=-23.5",
      });
      expect(res.statusCode).toBe(400);
    });

    it("retorna 400 para limit inválido", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/establishments?limit=200",
      });
      expect(res.statusCode).toBe(400);
    });
  });


  describe("GET /establishments/open — Redis cache real", () => {
    it("cache miss chama DB; cache hit não chama DB novamente", async () => {
      mockEstablishment.$queryRaw.mockResolvedValue([]);

      await app.inject({ method: "GET", url: "/establishments/open" });
      await app.inject({ method: "GET", url: "/establishments/open" });

      expect(mockEstablishment.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it("retorna apenas estabelecimentos retornados pela query de horários", async () => {
      mockEstablishment.$queryRaw.mockResolvedValue([{ id: ESTAB_ID }]);
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({ method: "GET", url: "/establishments/open" });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
      expect(body[0].id).toBe(ESTAB_ID);
    });
  });


  describe("GET /establishments/:id — Redis cache real", () => {
    it("cache miss → DB; cache hit → não chama DB novamente", async () => {
      mockEstablishment.findUnique.mockResolvedValue(makeEstablishment());

      await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });
      await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });

      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(1);
    });

    it("retorna perfil completo", async () => {
      mockEstablishment.findUnique.mockResolvedValue(makeEstablishment());

      const res = await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toMatchObject({ id: ESTAB_ID, name: "Bar do Zé" });
    });

    it("retorna 404 quando estabelecimento não existe", async () => {
      mockEstablishment.findUnique.mockResolvedValue(null);

      const res = await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });

      expect(res.statusCode).toBe(404);
    });
  });


  describe("PATCH /establishments/:id/rating", () => {
    it("requer autenticação JWT — retorna 401 sem token", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: `/establishments/${ESTAB_ID}/rating`,
        payload: { rating: 4.0 },
      });
      expect(res.statusCode).toBe(401);
    });

    it("atualiza rating com token válido e invalida cache Redis", async () => {
      const original = makeEstablishment();
      const updated = makeEstablishment({ averageRating: 3.0, qtdAvaliacoes: 11 });

      mockEstablishment.findUnique.mockResolvedValue(original);
      mockEstablishment.update.mockResolvedValue(updated);

      await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(1);

      const patchRes = await app.inject({
        method: "PATCH",
        url: `/establishments/${ESTAB_ID}/rating`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { rating: 3.0 },
      });
      expect(patchRes.statusCode).toBe(200);

      mockEstablishment.findUnique.mockResolvedValue(updated);
      await app.inject({ method: "GET", url: `/establishments/${ESTAB_ID}` });
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(3);
    });

    it("retorna 400 quando rating inválido", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: `/establishments/${ESTAB_ID}/rating`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { rating: 6 },
      });
      expect(res.statusCode).toBe(400);
    });

    it("retorna 404 quando estabelecimento não existe", async () => {
      mockEstablishment.findUnique.mockResolvedValue(null);

      const res = await app.inject({
        method: "PATCH",
        url: `/establishments/${ESTAB_ID}/rating`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { rating: 4.0 },
      });
      expect(res.statusCode).toBe(404);
    });
  });
});

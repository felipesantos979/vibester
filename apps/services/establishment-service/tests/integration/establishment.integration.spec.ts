import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

const isoDateRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const dateReviver = (_k: string, v: unknown) =>
  typeof v === 'string' && isoDateRe.test(v) ? new Date(v) : v;

vi.mock('../../src/config/redis', async () => {
  const { default: RedisMock } = await import('ioredis-mock');
  const redisMock = new RedisMock();
  return {
    redis: redisMock,
    cacheAside: async <T>(key: string, ttl: number, fetchFn: () => Promise<T>): Promise<T> => {
      try {
        const cached = await redisMock.get(key);
        if (cached !== null) return JSON.parse(cached, dateReviver) as T;
      } catch {}
      const data = await fetchFn();
      try { await redisMock.set(key, JSON.stringify(data), 'EX', ttl); } catch {}
      return data;
    },
  };
});

const { mockEstablishment } = vi.hoisted(() => ({
  mockEstablishment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../src/prisma/index', () => ({
  default: { establishment: mockEstablishment },
}));

import { buildServer } from '../helpers/fastify.test.helper';
import { redis } from '../../src/config/redis';

const ESTAB_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

function makeEstablishment(overrides: Record<string, unknown> = {}) {
  return {
    id: ESTAB_ID,
    googlePlaceId: 'ChIJ123',
    name: 'Bar do Zé',
    photoUrl: 'https://example.com/photo.jpg',
    bannerUrl: 'https://example.com/banner.jpg',
    category: 'bar',
    priceIndicator: '$$',
    averageRating: 4.5,
    latitude: -23.5,
    longitude: -46.6,
    openingHours: [],
    movementLevel: null,
    distanceTo: undefined,
    ...overrides,
  };
}

describe('establishment-service — HTTP Integration', () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => { app = await buildServer(); });
  afterAll(async () => { await app.close(); });
  beforeEach(async () => { vi.clearAllMocks(); await redis.flushall(); });

  describe('GET /health', () => {
    it('retorna 200 ok', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /establishments', () => {
    it('retorna lista de estabelecimentos sem filtros', async () => {
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({ method: 'GET', url: '/establishments' });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty('name', 'Bar do Zé');
    });

    it('filtra por categoria', async () => {
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment()]);

      const res = await app.inject({
        method: 'GET',
        url: '/establishments?category=bar',
      });

      expect(res.statusCode).toBe(200);
      expect(mockEstablishment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: expect.objectContaining({ equals: 'bar' }),
          }),
        })
      );
    });

    it('filtra por minRating', async () => {
      mockEstablishment.findMany.mockResolvedValue([makeEstablishment({ averageRating: 4.5 })]);

      const res = await app.inject({
        method: 'GET',
        url: '/establishments?minRating=4.0',
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

    it('ordena por distância quando coordenadas são fornecidas', async () => {
      const close = makeEstablishment({ latitude: -23.5, longitude: -46.6, name: 'Perto' });
      const far = makeEstablishment({ id: 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5', latitude: -24.0, longitude: -47.0, name: 'Longe' });
      mockEstablishment.findMany.mockResolvedValue([far, close]);

      const res = await app.inject({
        method: 'GET',
        url: '/establishments?latitude=-23.5&longitude=-46.6',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      // Primeiro deve ser o mais próximo
      expect(body[0].name).toBe('Perto');
    });

    it('retorna 400 se apenas latitude fornecida sem longitude', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/establishments?latitude=-23.5',
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /establishments/open — Redis cache', () => {
    it('cache miss chama banco, cache hit não', async () => {
      mockEstablishment.findMany.mockResolvedValue([]);

      await app.inject({ method: 'GET', url: '/establishments/open' });
      await app.inject({ method: 'GET', url: '/establishments/open' });

      expect(mockEstablishment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /establishments/:id — Redis cache', () => {
    it('retorna perfil do estabelecimento com cache miss→hit', async () => {
      mockEstablishment.findUnique.mockResolvedValue(makeEstablishment());

      const res1 = await app.inject({ method: 'GET', url: `/establishments/${ESTAB_ID}` });
      expect(res1.statusCode).toBe(200);
      const body = JSON.parse(res1.payload);
      expect(body).toHaveProperty('name', 'Bar do Zé');

      const res2 = await app.inject({ method: 'GET', url: `/establishments/${ESTAB_ID}` });
      expect(res2.statusCode).toBe(200);
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(1);
    });

    it('retorna 404 quando estabelecimento não existe', async () => {
      mockEstablishment.findUnique.mockResolvedValue(null);

      const res = await app.inject({ method: 'GET', url: `/establishments/${ESTAB_ID}` });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /establishments/:id/rating — cache invalidation', () => {
    it('atualiza rating, invalida cache e retorna 200', async () => {
      const original = makeEstablishment();
      mockEstablishment.findUnique.mockResolvedValue(original);

      // GET 1: cache miss → banco (findUnique #1)
      await app.inject({ method: 'GET', url: `/establishments/${ESTAB_ID}` });
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(1);

      // PATCH: findUnique para verificar existência (#2) + update + redis.del (invalida cache)
      const updated = makeEstablishment({ averageRating: 3.0 });
      mockEstablishment.findUnique.mockResolvedValue(updated);
      mockEstablishment.update.mockResolvedValue(updated);

      const res = await app.inject({
        method: 'PATCH',
        url: `/establishments/${ESTAB_ID}/rating`,
        payload: { rating: 3.0 },
      });
      expect(res.statusCode).toBe(200);
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(2); // GET + PATCH existence

      // GET 2: cache foi invalidado → banco novamente (findUnique #3)
      await app.inject({ method: 'GET', url: `/establishments/${ESTAB_ID}` });
      expect(mockEstablishment.findUnique).toHaveBeenCalledTimes(3);
    });

    it('retorna 400 quando rating inválido', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/establishments/${ESTAB_ID}/rating`,
        payload: { rating: 6 },
      });
      expect(res.statusCode).toBe(400);
    });
  });
});

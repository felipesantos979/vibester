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

const { mockEvent } = vi.hoisted(() => ({
  mockEvent: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('../../src/prisma/index', () => ({
  default: { event: mockEvent },
}));

import { buildServer } from '../helpers/fastify.test.helper';
import { redis } from '../../src/config/redis';

// UUIDs RFC 4122 válidos
const ESTABLISHMENT_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const EVENT_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: EVENT_ID,
    name: 'Show do Rock',
    photoUrl: 'https://example.com/photo.jpg',
    category: 'music',
    organizer: 'Promotora XYZ',
    location: 'Rua A, 100',
    informacoes: null,
    startDate: new Date('2026-07-01T20:00:00.000Z'),
    endDate: new Date('2026-07-01T23:00:00.000Z'),
    ticketLink: 'https://ingresso.com/show',
    totalConfirmed: 0,
    latitude: -23.5,
    longitude: -46.6,
    isFeatured: false,
    establishmentId: ESTABLISHMENT_ID,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

const CREATE_BODY = {
  name: 'Show do Rock',
  photoUrl: 'https://example.com/photo.jpg',
  category: 'music',
  organizer: 'Promotora XYZ',
  location: 'Rua A, 100',
  startDate: '2026-07-01T20:00:00.000Z',
  endDate: '2026-07-01T23:00:00.000Z',
  ticketLink: 'https://ingresso.com/show',
  latitude: -23.5,
  longitude: -46.6,
  establishmentId: ESTABLISHMENT_ID,
};

describe('event-service — HTTP Integration', () => {
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

  describe('POST /events', () => {
    it('cria evento e retorna 201', async () => {
      mockEvent.create.mockResolvedValue(makeEvent());

      const res = await app.inject({
        method: 'POST',
        url: '/events',
        payload: CREATE_BODY,
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('id', EVENT_ID);
      expect(body).toHaveProperty('name', 'Show do Rock');
      expect(mockEvent.create).toHaveBeenCalledTimes(1);
    });

    it('invalida cache do estabelecimento ao criar evento', async () => {
      // Popula cache de events por estabelecimento
      mockEvent.findMany.mockResolvedValue([makeEvent()]);
      await app.inject({ method: 'GET', url: `/events/establishment/${ESTABLISHMENT_ID}` });
      expect(mockEvent.findMany).toHaveBeenCalledTimes(1);

      // Cria novo evento (deve invalidar cache)
      mockEvent.create.mockResolvedValue(makeEvent());
      await app.inject({ method: 'POST', url: '/events', payload: CREATE_BODY });

      // Próxima busca deve chamar DB novamente
      mockEvent.findMany.mockResolvedValue([makeEvent(), makeEvent()]);
      await app.inject({ method: 'GET', url: `/events/establishment/${ESTABLISHMENT_ID}` });
      expect(mockEvent.findMany).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /events/nearby', () => {
    it('retorna eventos filtrados por raio geográfico', async () => {
      const events = [makeEvent({ latitude: -23.5, longitude: -46.6 })];
      mockEvent.findMany.mockResolvedValue(events);

      const res = await app.inject({
        method: 'GET',
        url: '/events/nearby?latitude=-23.5&longitude=-46.6&radiusKm=10',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty('distanceKm');
    });

    it('retorna lista vazia quando nenhum evento está no raio', async () => {
      const farEvent = makeEvent({ latitude: -30.0, longitude: -51.0 });
      mockEvent.findMany.mockResolvedValue([farEvent]);

      const res = await app.inject({
        method: 'GET',
        url: '/events/nearby?latitude=-23.5&longitude=-46.6&radiusKm=1',
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveLength(0);
    });
  });

  describe('GET /events/establishment/:establishmentId — Redis cache', () => {
    it('cache miss chama banco, cache hit não chama banco', async () => {
      const events = [{ name: 'Show', organizer: 'Org', location: 'Loc', totalConfirmed: 0, ticketLink: null }];
      mockEvent.findMany.mockResolvedValue(events);

      await app.inject({ method: 'GET', url: `/events/establishment/${ESTABLISHMENT_ID}` });
      await app.inject({ method: 'GET', url: `/events/establishment/${ESTABLISHMENT_ID}` });

      expect(mockEvent.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /events/:eventId — Redis cache', () => {
    it('retorna detalhes do evento com cache', async () => {
      const event = makeEvent();
      mockEvent.findUnique.mockResolvedValue(event);

      const res1 = await app.inject({ method: 'GET', url: `/events/${EVENT_ID}` });
      expect(res1.statusCode).toBe(200);
      const body = JSON.parse(res1.payload);
      expect(body).toHaveProperty('name', 'Show do Rock');

      // Cache hit
      const res2 = await app.inject({ method: 'GET', url: `/events/${EVENT_ID}` });
      expect(res2.statusCode).toBe(200);
      expect(mockEvent.findUnique).toHaveBeenCalledTimes(1);
    });

    it('retorna 404 quando evento não existe', async () => {
      mockEvent.findUnique.mockResolvedValue(null);

      const res = await app.inject({ method: 'GET', url: `/events/${EVENT_ID}` });
      expect(res.statusCode).toBe(404);
    });
  });
});

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

// Mock do Cassandra - execute retorna { rows: [] } por padrão
const { mockExecute } = vi.hoisted(() => ({ mockExecute: vi.fn().mockResolvedValue({ rows: [] }) }));
vi.mock('../../src/config/cassandra', () => ({
  cassandraClient: { execute: mockExecute },
}));

const { mockProducerSend } = vi.hoisted(() => ({ mockProducerSend: vi.fn() }));
vi.mock('../../src/kafka/producer', () => ({
  producer: { connect: vi.fn(), disconnect: vi.fn(), send: mockProducerSend },
}));

import { buildServer } from '../helpers/fastify.test.helper';
import { redis } from '../../src/config/redis';

// UUIDs RFC 4122 válidos
const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const POST_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const ESTAB_ID = 'c1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

// Row no formato Cassandra (snake_case)
function makeCassandraRow(overrides: Record<string, unknown> = {}) {
  return {
    post_id: POST_ID,
    user_id: USER_ID,
    establishment_id: ESTAB_ID,
    image_url: ['https://example.com/img.jpg'],
    caption: 'Test post',
    total_likes: 0,
    total_comments: 0,
    is_deleted: false,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: null,
    ...overrides,
  };
}

function makePost(overrides: Record<string, unknown> = {}) {
  return {
    postId: POST_ID,
    userId: USER_ID,
    establishmentId: ESTAB_ID,
    imageUrls: ['https://example.com/img.jpg'],
    caption: 'Test post',
    totalLikes: 0,
    totalComments: 0,
    isDeleted: false,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('post-service — HTTP Integration', () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => { app = await buildServer(); });
  afterAll(async () => { await app.close(); });
  beforeEach(async () => {
    vi.resetAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
    await redis.flushall();
  });

  describe('GET /health', () => {
    it('retorna 200 ok', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /posts', () => {
    it('cria post e retorna 201', async () => {
      // Cassandra execute retorna success para INSERTs (rows vazias)
      mockExecute.mockResolvedValue({ rows: [] });

      const res = await app.inject({
        method: 'POST',
        url: '/posts',
        payload: {
          userId: USER_ID,
          imageUrls: ['https://example.com/img.jpg'],
          caption: 'Test post',
          establishmentId: ESTAB_ID,
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('userId', USER_ID);
      expect(body).toHaveProperty('caption', 'Test post');
      expect(body).toHaveProperty('postId');
      // execute deve ser chamado para: createPostById, createPostByUser, createPostByEstablishment, redis.del (não cassandra)
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('GET /posts/:postId — Redis cache', () => {
    it('cache miss: busca no Cassandra e armazena no cache', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [makeCassandraRow()] }); // findById

      const res = await app.inject({ method: 'GET', url: `/posts/${POST_ID}` });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('postId', POST_ID);
    });

    it('cache hit: não chama Cassandra na segunda requisição', async () => {
      // Primeira chamada: populate cache
      mockExecute.mockResolvedValueOnce({ rows: [makeCassandraRow()] });
      await app.inject({ method: 'GET', url: `/posts/${POST_ID}` });
      const callsAfterFirst = mockExecute.mock.calls.length;

      // Segunda chamada: cache hit
      const res = await app.inject({ method: 'GET', url: `/posts/${POST_ID}` });
      expect(res.statusCode).toBe(200);
      expect(mockExecute.mock.calls.length).toBe(callsAfterFirst); // sem novas chamadas ao Cassandra
    });

    it('retorna 404 quando post não existe', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      const res = await app.inject({ method: 'GET', url: `/posts/${POST_ID}` });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /users/:userId/posts', () => {
    it('retorna posts do usuário com cache', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [makeCassandraRow()] });

      const res1 = await app.inject({ method: 'GET', url: `/users/${USER_ID}/posts` });
      expect(res1.statusCode).toBe(200);

      // Cache hit
      const res2 = await app.inject({ method: 'GET', url: `/users/${USER_ID}/posts` });
      expect(res2.statusCode).toBe(200);
    });
  });

  describe('DELETE /posts/:postId (soft delete)', () => {
    it('marca post como deletado e retorna 204', async () => {
      // findById retorna o post, depois soft deletes
      mockExecute
        .mockResolvedValueOnce({ rows: [makeCassandraRow()] }) // findById
        .mockResolvedValue({ rows: [] }); // deletes

      const res = await app.inject({ method: 'DELETE', url: `/posts/${POST_ID}` });
      expect(res.statusCode).toBe(204);
    });
  });
});

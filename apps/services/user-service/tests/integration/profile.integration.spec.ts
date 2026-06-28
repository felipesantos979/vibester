import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

vi.mock('../../src/config/redis', async () => {
  const { default: RedisMock } = await import('ioredis-mock');
  const redisMock = new RedisMock();

  const isoDateRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  const dateReviver = (_k: string, v: unknown) =>
    typeof v === 'string' && isoDateRe.test(v) ? new Date(v) : v;

  return {
    redis: redisMock,
    cacheAside: async <T>(key: string, ttl: number, fetchFn: () => Promise<T>): Promise<T> => {
      try {
        const cached = await redisMock.get(key);
        if (cached !== null) return JSON.parse(cached, dateReviver) as T;
      } catch {}
      const data = await fetchFn();
      try {
        await redisMock.set(key, JSON.stringify(data), 'EX', ttl);
      } catch {}
      return data;
    },
  };
});

const { mockUserProfile, mockUserFollow } = vi.hoisted(() => ({
  mockUserProfile: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findUniqueOrThrow: vi.fn(),
  },
  mockUserFollow: {
    create: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('../../src/prisma/index', () => ({
  default: { userProfile: mockUserProfile, userFollow: mockUserFollow },
}));

const { mockProducerSend } = vi.hoisted(() => ({ mockProducerSend: vi.fn() }));
vi.mock('../../src/kafka/producer', () => ({
  producer: { connect: vi.fn(), disconnect: vi.fn(), send: mockProducerSend },
}));

import { buildServer } from '../helpers/fastify.test.helper';
import { redis } from '../../src/config/redis';

// UUIDs RFC 4122 válidos: versão 4 (grupo 3 começa com '4') e variante 8/9/a/b (grupo 4 começa com [89ab])
const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const PROFILE_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const FOLLOWER_ID = 'c1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const NOT_FOUND_ID = 'd1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: PROFILE_ID,
    userID: USER_ID,
    name: null,
    username: null,
    avatarUrl: null,
    bio: null,
    followers: 0,
    following: 0,
    totalPosts: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('user-service — HTTP Integration', () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => { app = await buildServer(); });
  afterAll(async () => { await app.close(); });

  beforeEach(async () => {
    vi.clearAllMocks();
    await redis.flushall();
  });

  describe('GET /health', () => {
    it('retorna 200 com status ok', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ status: 'ok' });
    });
  });

  describe('POST /users/profile', () => {
    it('cria perfil e retorna 201 com profileId', async () => {
      mockUserProfile.create.mockResolvedValue(makeProfile());

      const res = await app.inject({
        method: 'POST',
        url: '/users/profile',
        payload: { userID: USER_ID },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('profileId', PROFILE_ID);
      expect(body).toHaveProperty('userID', USER_ID);
      expect(mockUserProfile.create).toHaveBeenCalledWith({ data: { userID: USER_ID } });
    });
  });

  describe('GET /users/profile/:id — Redis cache-aside', () => {
    it('retorna 200 no cache miss e consulta o banco', async () => {
      mockUserProfile.findUnique.mockResolvedValue(makeProfile());

      const res = await app.inject({ method: 'GET', url: `/users/profile/${PROFILE_ID}` });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveProperty('profileId', PROFILE_ID);
      expect(mockUserProfile.findUnique).toHaveBeenCalledTimes(1);
    });

    it('retorna 200 no cache hit sem consultar o banco', async () => {
      mockUserProfile.findUnique.mockResolvedValue(makeProfile());

      await app.inject({ method: 'GET', url: `/users/profile/${PROFILE_ID}` });
      const res = await app.inject({ method: 'GET', url: `/users/profile/${PROFILE_ID}` });

      expect(res.statusCode).toBe(200);
      expect(mockUserProfile.findUnique).toHaveBeenCalledTimes(1);
    });

    it('retorna 404 quando perfil não existe', async () => {
      mockUserProfile.findUnique.mockResolvedValue(null);

      const res = await app.inject({
        method: 'GET',
        url: `/users/profile/${NOT_FOUND_ID}`,
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /users/profile/bio — cache invalidation', () => {
    it('atualiza bio, invalida cache e retorna 200', async () => {
      const original = makeProfile();
      const updated = makeProfile({ bio: 'Nova bio' });

      mockUserProfile.findUnique.mockResolvedValue(original);
      await app.inject({ method: 'GET', url: `/users/profile/${PROFILE_ID}` });
      expect(mockUserProfile.findUnique).toHaveBeenCalledTimes(1);

      mockUserProfile.update.mockResolvedValue(updated);
      const res = await app.inject({
        method: 'PUT',
        url: '/users/profile/bio',
        payload: { userID: USER_ID, bio: 'Nova bio' },
      });
      expect(res.statusCode).toBe(200);

      // Cache invalidado: próximo GET chama banco novamente
      mockUserProfile.findUnique.mockResolvedValue(updated);
      await app.inject({ method: 'GET', url: `/users/profile/${PROFILE_ID}` });
      expect(mockUserProfile.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('PUT /users/profile/avatar', () => {
    it('atualiza avatar e retorna 200', async () => {
      const avatarUrl = 'https://example.com/avatar.jpg';
      mockUserProfile.update.mockResolvedValue(makeProfile({ avatarUrl }));

      const res = await app.inject({
        method: 'PUT',
        url: '/users/profile/avatar',
        payload: { userID: USER_ID, avatarUrl },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).avatarUrl).toBe(avatarUrl);
    });
  });

  describe('POST /users/profile/followers/increase — Kafka', () => {
    it('registra follow, atualiza contadores e emite user.followed no Kafka', async () => {
      const updated = makeProfile({ followers: 1 });
      mockUserFollow.create.mockResolvedValue({});
      mockUserProfile.update.mockResolvedValue(updated);
      mockUserProfile.findUniqueOrThrow.mockResolvedValue(updated);

      const res = await app.inject({
        method: 'POST',
        url: '/users/profile/followers/increase',
        payload: { followerId: FOLLOWER_ID, followingId: USER_ID },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload).followers).toBe(1);
      expect(mockProducerSend).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'user.followed',
          messages: expect.arrayContaining([
            expect.objectContaining({
              value: JSON.stringify({ followerId: FOLLOWER_ID, followingId: USER_ID }),
            }),
          ]),
        })
      );
    });
  });

  describe('POST /users/profile/followers/decrease', () => {
    it('remove follow, atualiza contadores e retorna 200', async () => {
      const updated = makeProfile({ followers: 0 });
      mockUserFollow.delete.mockResolvedValue({});
      mockUserProfile.update.mockResolvedValue(updated);
      mockUserProfile.findUniqueOrThrow.mockResolvedValue(updated);

      const res = await app.inject({
        method: 'POST',
        url: '/users/profile/followers/decrease',
        payload: { followerId: FOLLOWER_ID, followingId: USER_ID },
      });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /users/:userID/followers — Redis cache', () => {
    it('retorna seguidores: cache miss chama banco, cache hit não', async () => {
      const followers = [{ followerId: FOLLOWER_ID, createdAt: new Date('2024-01-01T00:00:00.000Z') }];
      mockUserFollow.findMany.mockResolvedValue(followers);

      const res1 = await app.inject({ method: 'GET', url: `/users/${USER_ID}/followers` });
      expect(res1.statusCode).toBe(200);
      expect(JSON.parse(res1.payload)).toHaveLength(1);

      const res2 = await app.inject({ method: 'GET', url: `/users/${USER_ID}/followers` });
      expect(res2.statusCode).toBe(200);
      expect(mockUserFollow.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /users/:userID/following — Redis cache', () => {
    it('retorna seguidos: cache miss chama banco, cache hit não', async () => {
      const following = [{ followingId: USER_ID, createdAt: new Date('2024-01-01T00:00:00.000Z') }];
      mockUserFollow.findMany.mockResolvedValue(following);

      const res = await app.inject({ method: 'GET', url: `/users/${FOLLOWER_ID}/following` });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveLength(1);

      await app.inject({ method: 'GET', url: `/users/${FOLLOWER_ID}/following` });
      expect(mockUserFollow.findMany).toHaveBeenCalledTimes(1);
    });
  });
});

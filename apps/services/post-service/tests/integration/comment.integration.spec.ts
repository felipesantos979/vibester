import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

vi.mock('../../src/config/redis', async () => {
  const { default: RedisMock } = await import('ioredis-mock');
  const redisMock = new RedisMock();
  return {
    redis: redisMock,
    cacheAside: async <T>(_key: string, _ttl: number, fetchFn: () => Promise<T>): Promise<T> => fetchFn(),
  };
});

const { mockExecute } = vi.hoisted(() => ({ mockExecute: vi.fn().mockResolvedValue({ rows: [] }) }));
vi.mock('../../src/config/cassandra', () => ({
  getCassandraClient: vi.fn(() => ({ execute: mockExecute })),
}));

const { mockProducerSend } = vi.hoisted(() => ({ mockProducerSend: vi.fn() }));
vi.mock('../../src/kafka/producer', () => ({
  producer: { connect: vi.fn(), disconnect: vi.fn(), send: mockProducerSend },
}));

import { buildServer } from '../helpers/fastify.test.helper';

const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const POST_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const COMMENTER_ID = 'c1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

function makeCassandraPostRow(overrides: Record<string, unknown> = {}) {
  return {
    post_id: POST_ID,
    user_id: USER_ID,
    establishment_id: null,
    image_urls: ['https://example.com/img.jpg'],
    caption: 'Test post',
    total_likes: 0,
    total_comments: 0,
    is_deleted: false,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: null,
    ...overrides,
  };
}

describe('post-service — Comments Integration', () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => { app = await buildServer(); });
  afterAll(async () => { await app.close(); });
  beforeEach(() => {
    vi.resetAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('POST /comments — Kafka', () => {
    it('cria comentário e emite post.commented no Kafka', async () => {
      mockExecute
        .mockResolvedValueOnce({ rows: [makeCassandraPostRow()] }) // findById (post exists)
        .mockResolvedValue({ rows: [] }); // inserts, updates

      const res = await app.inject({
        method: 'POST',
        url: '/comments',
        payload: {
          postId: POST_ID,
          userId: COMMENTER_ID,
          content: 'Que lugar incrível!',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('postId', POST_ID);
      expect(body).toHaveProperty('userId', COMMENTER_ID);
      expect(body).toHaveProperty('content', 'Que lugar incrível!');
      expect(body).toHaveProperty('commentId');

      expect(mockProducerSend).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'post.commented',
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: POST_ID,
              value: expect.stringContaining('Que lugar incrível!'),
            }),
          ]),
        })
      );
    });

    it('retorna 404 quando post não existe', async () => {
      mockExecute.mockResolvedValue({ rows: [] }); // post not found

      const res = await app.inject({
        method: 'POST',
        url: '/comments',
        payload: { postId: POST_ID, userId: COMMENTER_ID, content: 'comentário' },
      });

      expect(res.statusCode).toBe(404);
      expect(mockProducerSend).not.toHaveBeenCalled();
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('retorna comentários do post', async () => {
      const commentRows = [
        {
          comment_id: 'd1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5',
          post_id: POST_ID,
          user_id: COMMENTER_ID,
          content: 'Ótimo post!',
          is_deleted: false,
          created_at: new Date(),
          updated_at: null,
        },
      ];
      mockExecute.mockResolvedValueOnce({ rows: commentRows });

      const res = await app.inject({ method: 'GET', url: `/posts/${POST_ID}/comments` });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body).toHaveLength(1);
    });
  });
});

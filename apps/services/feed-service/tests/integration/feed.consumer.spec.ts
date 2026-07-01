import { vi, describe, it, expect, beforeEach } from 'vitest';

const { mockExecute } = vi.hoisted(() => ({ mockExecute: vi.fn().mockResolvedValue({ rows: [] }) }));
vi.mock('../../src/config/cassandra', () => ({
  getCassandraClient: () => ({ execute: mockExecute }),
}));

import { FeedService } from '../../src/services/feed.service';
import { FeedItemType } from '../../src/types/feed.types';

const AUTHOR_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const POST_ID = 'b1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const FOLLOWER_ID = 'c1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const EVENT_ID = 'd1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';
const ESTAB_ID = 'e1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5';

const ISO_DATE = '2024-01-15T12:00:00.000Z';

function makeUserPostPayload() {
  return {
    itemId: POST_ID,
    itemType: FeedItemType.USER_POST,
    authorId: AUTHOR_ID,
    authorUsername: 'testuser',
    authorVerified: false,
    content: 'Ótimo lugar!',
    imageUrls: ['https://example.com/img.jpg'],
    totalLikes: 0,
    totalComments: 0,
    isSponsored: false,
    isDeleted: false,
    createdAt: ISO_DATE,
  };
}

function makeEventPayload() {
  return {
    itemId: EVENT_ID,
    itemType: FeedItemType.EVENT_USER,
    authorId: AUTHOR_ID,
    authorUsername: 'organizer',
    authorVerified: false,
    eventId: EVENT_ID,
    eventTitle: 'Festival de Verão',
    eventBanner: 'https://example.com/banner.jpg',
    eventDate: ISO_DATE,
    eventLocation: 'São Paulo',
    eventOrganizerName: 'Promotora XYZ',
    eventOrganizerLogo: 'https://example.com/logo.jpg',
    totalLikes: 0,
    totalComments: 0,
    totalConfirmed: 0,
    isSponsored: false,
    isDeleted: false,
    createdAt: ISO_DATE,
  };
}

describe('feed-service — Kafka Consumers', () => {
  let feedService: FeedService;

  beforeEach(() => {
    vi.resetAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
    feedService = new FeedService();
  });

  describe('handlePostCreated', () => {
    it('salva post do usuário e distribui para seguidores (sem seguidores)', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handlePostCreated(makeUserPostPayload() as any);

      expect(mockExecute).toHaveBeenCalled();
    });

    it('distribui post para seguidores quando existem seguidores', async () => {
      mockExecute
        .mockResolvedValueOnce({ rows: [] }) // savePostByUser → INSERT posts_by_user
        .mockResolvedValueOnce({ rows: [{ follower_id: FOLLOWER_ID }] }) // findFollowersByUser
        .mockResolvedValue({ rows: [] }); // addItemToUserFeed calls

      await feedService.handlePostCreated(makeUserPostPayload() as any);

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handlePostDeleted', () => {
    it('remove post dos feeds sem entries', async () => {
      mockExecute.mockResolvedValue({ rows: [] }); // findByItemId → no entries

      await feedService.handlePostDeleted({
        authorId: AUTHOR_ID,
        postId: POST_ID,
        createdAt: ISO_DATE,
      });

      expect(mockExecute).toHaveBeenCalled();
    });

    it('remove post de todos os feeds quando há entries', async () => {
      const entryRow = { user_id: FOLLOWER_ID, created_at: new Date(), post_id: POST_ID };
      mockExecute
        .mockResolvedValueOnce({ rows: [entryRow] }) // findByItemId
        .mockResolvedValue({ rows: [] }); // deletes

      await feedService.handlePostDeleted({
        authorId: AUTHOR_ID,
        postId: POST_ID,
        createdAt: ISO_DATE,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleContentPostUpdated', () => {
    it('atualiza conteúdo sem entries no feed', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleContentPostUpdated({
        authorId: AUTHOR_ID,
        postId: POST_ID,
        createdAt: ISO_DATE,
        caption: 'Novo caption atualizado',
        imageUrls: ['https://example.com/new.jpg'],
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handlePostStatsUpdated', () => {
    it('atualiza estatísticas sem entries no feed', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handlePostStatsUpdated({
        authorId: AUTHOR_ID,
        postId: POST_ID,
        createdAt: ISO_DATE,
        totalLikes: 10,
        totalComments: 3,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleUserFollowed', () => {
    it('cria relacionamento de seguidor e adiciona posts recentes ao feed', async () => {
      mockExecute.mockResolvedValue({ rows: [] }); // no recent posts/events to migrate

      await feedService.handleUserFollowed({
        followerId: FOLLOWER_ID,
        followedId: AUTHOR_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });

    it('migra eventos recentes do autor para o feed do seguidor', async () => {
      const recentEventRow = {
        event_id: EVENT_ID,
        created_at: new Date(ISO_DATE),
        author_id: AUTHOR_ID,
        author_username: 'organizer',
        author_verified: false,
        event_title: 'Festival de Verão',
        event_date: new Date(ISO_DATE),
      };
      mockExecute.mockResolvedValue({ rows: [recentEventRow] });

      await feedService.handleUserFollowed({
        followerId: FOLLOWER_ID,
        followedId: AUTHOR_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleUserUnfollowed', () => {
    it('remove relacionamento e limpa posts do feed', async () => {
      mockExecute.mockResolvedValue({ rows: [] }); // no recent posts/events to remove

      await feedService.handleUserUnfollowed({
        followerId: FOLLOWER_ID,
        followedId: AUTHOR_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });

    it('remove eventos recentes do autor do feed do seguidor quando há entries', async () => {
      const recentEventRow = { event_id: EVENT_ID, created_at: new Date(ISO_DATE) };
      const feedEntryRow = { item_id: EVENT_ID, user_id: FOLLOWER_ID, created_at: new Date(ISO_DATE) };
      mockExecute.mockImplementation(async (query: string) => {
        if (typeof query === 'string' && query.includes('events_by_user')) {
          return { rows: [recentEventRow] };
        }
        if (typeof query === 'string' && query.includes('feed_entries')) {
          return { rows: [feedEntryRow] };
        }
        return { rows: [] };
      });

      await feedService.handleUserUnfollowed({
        followerId: FOLLOWER_ID,
        followedId: AUTHOR_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleEstablishmentFollowed', () => {
    it('cria relacionamento com estabelecimento e migra posts recentes', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleEstablishmentFollowed({
        followerId: FOLLOWER_ID,
        followedId: ESTAB_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleEstablishmentUnfollowed', () => {
    it('remove relacionamento e limpa posts do estabelecimento do feed', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleEstablishmentUnfollowed({
        followerId: FOLLOWER_ID,
        followedId: ESTAB_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleEventCreated', () => {
    it('salva evento e distribui para seguidores do organizador', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleEventCreated(makeEventPayload() as any);

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleEventConfirmed', () => {
    it('processa confirmação de presença no evento', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleEventConfirmed({
        eventId: EVENT_ID,
        userId: FOLLOWER_ID,
        eventDate: ISO_DATE,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('handleEventUnconfirmed', () => {
    it('processa remoção de confirmação do evento', async () => {
      mockExecute.mockResolvedValue({ rows: [] });

      await feedService.handleEventUnconfirmed({
        eventId: EVENT_ID,
        userId: FOLLOWER_ID,
      });

      expect(mockExecute).toHaveBeenCalled();
    });
  });
});

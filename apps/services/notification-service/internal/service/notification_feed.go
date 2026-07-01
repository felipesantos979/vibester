package service

import (
	"context"
	"notification-service/internal/clients"
	"notification-service/internal/models"
	"notification-service/internal/repository"
	"time"
)

const (
	defaultListLimit = 50
	rawFetchLimit    = 200
)

// NotificationFeedService monta a resposta da API de notificações: busca as
// linhas cruas, agrupa (GroupNotifications) e enriquece cada grupo com
// dados de ator/post buscados em outros serviços.
type NotificationFeedService struct {
	userClient *clients.UserClient
	postClient *clients.PostClient
}

func NewNotificationFeedService() *NotificationFeedService {
	return &NotificationFeedService{
		userClient: clients.NewUserClient(),
		postClient: clients.NewPostClient(),
	}
}

// BuildFeed retorna a lista paginada e enriquecida de notificações
// agrupadas de um destinatário.
func (s *NotificationFeedService) BuildFeed(
	recipientId string,
	limit int,
	before *time.Time,
) (models.NotificationListResponse, error) {
	if limit <= 0 {
		limit = defaultListLimit
	}

	rows, err := repository.ListByRecipient(recipientId, rawFetchLimit, before)
	if err != nil {
		return models.NotificationListResponse{}, err
	}

	groups := GroupNotifications(rows)

	truncated := len(groups) > limit
	if truncated {
		groups = groups[:limit]
	}

	items := s.enrich(groups)

	var nextCursor *time.Time
	hasMore := truncated || len(rows) >= rawFetchLimit
	if hasMore && len(groups) > 0 {
		last := groups[len(groups)-1].CreatedAt
		nextCursor = &last
	}

	return models.NotificationListResponse{Items: items, NextCursor: nextCursor}, nil
}

// CountUnreadGroups conta quantos grupos (não linhas cruas) de notificação
// ainda não foram lidos por um destinatário — usado pelo badge do app.
func (s *NotificationFeedService) CountUnreadGroups(recipientId string) (int, error) {
	rows, err := repository.ListUnreadByRecipient(recipientId)
	if err != nil {
		return 0, err
	}

	return len(GroupNotifications(rows)), nil
}

// enrich busca nome/avatar do ator e (para like/comment) miniatura/legenda
// do post de cada grupo, com dedupe em memória por request — não há
// endpoints de busca em lote nos outros serviços hoje, então cada ator/post
// distinto na página gera no máximo 1 chamada HTTP.
func (s *NotificationFeedService) enrich(groups []models.NotificationGroup) []models.NotificationGroupResponse {
	ctx := context.Background()

	actorCache := make(map[string]*models.ActorSummary)
	postCache := make(map[string]*models.PostSummary)

	items := make([]models.NotificationGroupResponse, 0, len(groups))

	for _, g := range groups {
		actor, cached := actorCache[g.ActorID]
		if !cached {
			actor, _ = s.userClient.GetProfile(ctx, g.ActorID)
			actorCache[g.ActorID] = actor
		}

		var post *models.PostSummary
		if g.Type == "like" || g.Type == "comment" {
			cachedPost, ok := postCache[g.RefID]
			if !ok {
				cachedPost, _ = s.postClient.GetPost(ctx, g.RefID)
				postCache[g.RefID] = cachedPost
			}
			post = cachedPost
		}

		items = append(items, models.NotificationGroupResponse{
			ID:          g.Key,
			Type:        g.Type,
			RefID:       g.RefID,
			OthersCount: g.OthersCount,
			TotalCount:  g.TotalCount,
			Content:     g.Content,
			Read:        g.Read,
			CreatedAt:   g.CreatedAt,
			Actor:       actor,
			Post:        post,
		})
	}

	return items
}

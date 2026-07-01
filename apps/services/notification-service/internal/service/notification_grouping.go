package service

import "notification-service/internal/models"

// GroupNotifications agrupa linhas cruas de notificação (já ordenadas por
// created_at DESC) em grupos exibíveis, ex: "Fulano e mais 2 pessoas
// curtiram o post X". Função pura, sem I/O, para ser testável sem banco.
//
// Regra de agrupamento:
//   - like/comment: chave = tipo + refId (agrupa por post).
//   - follow: refId é sempre vazio, então usamos "follow:unread" para tudo
//     que ainda não foi visto, e "follow:read:AAAA-MM-DD" (dia de
//     created_at, UTC) para o que já foi visto.
//
// O ator de destaque de cada grupo é o mais recente (primeira linha
// encontrada, já que a entrada está em ordem DESC). Um grupo só é
// considerado "read" se todas as suas linhas forem read.
func GroupNotifications(rows []models.NotificationRow) []models.NotificationGroup {
	groups := make(map[string]*models.NotificationGroup)
	order := make([]string, 0)

	for _, row := range rows {
		key := groupKey(row)

		g, exists := groups[key]
		if !exists {
			g = &models.NotificationGroup{
				Key:       key,
				Type:      row.Type,
				RefID:     row.RefID,
				ActorID:   row.ActorID,
				Content:   row.Content,
				Read:      true,
				CreatedAt: row.CreatedAt,
			}
			groups[key] = g
			order = append(order, key)
		}

		if !containsActor(g.ActorIDs, row.ActorID) {
			g.ActorIDs = append(g.ActorIDs, row.ActorID)
		}
		if !row.Read {
			g.Read = false
		}
	}

	result := make([]models.NotificationGroup, 0, len(order))
	for _, key := range order {
		g := groups[key]
		g.TotalCount = len(g.ActorIDs)
		g.OthersCount = g.TotalCount - 1
		if g.OthersCount < 0 {
			g.OthersCount = 0
		}
		result = append(result, *g)
	}

	return result
}

func groupKey(row models.NotificationRow) string {
	if row.Type == "follow" {
		if row.Read {
			return "follow:read:" + row.CreatedAt.UTC().Format("2006-01-02")
		}
		return "follow:unread"
	}

	return row.Type + ":" + row.RefID
}

func containsActor(actorIDs []string, actorID string) bool {
	for _, id := range actorIDs {
		if id == actorID {
			return true
		}
	}
	return false
}

package repository

import (
	"context"
	"notification-service/internal/database"
	"notification-service/internal/models"
	"time"

	"github.com/jackc/pgx/v5"
)

func CreateNotification(notifType, recipientId, actorId, refId, content string) error {
	_, err := database.DB.Exec(context.Background(), `
		INSERT INTO notifications (type, recipient_id, actor_id, ref_id, content)
		VALUES ($1, $2, $3, $4, $5)
	`, notifType, recipientId, actorId, refId, content)
	return err
}

// ListByRecipient busca as notificações mais recentes de um destinatário,
// mais novas primeiro, com paginação por cursor (before = created_at da
// última linha da página anterior).
func ListByRecipient(recipientId string, limit int, before *time.Time) ([]models.NotificationRow, error) {
	query := `
		SELECT id, type, recipient_id, actor_id, ref_id, content, read, created_at
		FROM notifications
		WHERE recipient_id = $1
		  AND ($2::timestamp IS NULL OR created_at < $2)
		ORDER BY created_at DESC
		LIMIT $3
	`

	rows, err := database.DB.Query(
		context.Background(),
		query,
		recipientId,
		before,
		limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanNotificationRows(rows)
}

// ListUnreadByRecipient busca todas as notificações não lidas de um
// destinatário (usado para o contador de não vistas). Limitado
// defensivamente já que não é paginado.
func ListUnreadByRecipient(recipientId string) ([]models.NotificationRow, error) {
	query := `
		SELECT id, type, recipient_id, actor_id, ref_id, content, read, created_at
		FROM notifications
		WHERE recipient_id = $1 AND read = false
		ORDER BY created_at DESC
		LIMIT 500
	`

	rows, err := database.DB.Query(context.Background(), query, recipientId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanNotificationRows(rows)
}

// MarkAllReadByRecipient marca como lidas todas as notificações não lidas
// de um destinatário. Retorna quantas linhas foram afetadas.
func MarkAllReadByRecipient(recipientId string) (int64, error) {
	tag, err := database.DB.Exec(context.Background(), `
		UPDATE notifications SET read = true
		WHERE recipient_id = $1 AND read = false
	`, recipientId)
	if err != nil {
		return 0, err
	}

	return tag.RowsAffected(), nil
}

func scanNotificationRows(rows pgx.Rows) ([]models.NotificationRow, error) {
	result := make([]models.NotificationRow, 0)

	for rows.Next() {
		var n models.NotificationRow

		if err := rows.Scan(
			&n.ID,
			&n.Type,
			&n.RecipientID,
			&n.ActorID,
			&n.RefID,
			&n.Content,
			&n.Read,
			&n.CreatedAt,
		); err != nil {
			return nil, err
		}

		result = append(result, n)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

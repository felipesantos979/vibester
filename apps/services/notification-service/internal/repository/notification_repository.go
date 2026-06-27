package repository

import (
	"context"
	"notification-service/internal/database"
)

func CreateNotification(notifType, recipientId, actorId, refId, content string) error {
	_, err := database.DB.Exec(context.Background(), `
		INSERT INTO notifications (type, recipient_id, actor_id, ref_id, content)
		VALUES ($1, $2, $3, $4, $5)
	`, notifType, recipientId, actorId, refId, content)
	return err
}

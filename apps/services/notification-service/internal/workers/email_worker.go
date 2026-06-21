package workers

import (
	"notification-service/internal/models"
	"notification-service/internal/services"
	"notification-service/internal/utils"
)

var EmailQueue = make(chan models.Notification, 100)

func StartEmailWorker() {
	go func() {

		for notification := range EmailQueue {
			utils.Logger.Info(
				"Processando email",
				"to", notification.To,
			)

			err := services.SendEmail(
				notification.To,
				notification.Subject,
				notification.Message,
			)

			if err != nil {
				utils.Logger.Error(
					"Falha no processamento",
					"error", err,
				)
			}
		}

	}()
}

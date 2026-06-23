package workers

import (
	"notification-service/internal/models"
	"notification-service/internal/services"
	"notification-service/internal/utils"
	"time"
)

var EmailQueue = make(chan models.Notification, 100)

func StartEmailWorkers(workerCount int) {
	for i := 1; i <= workerCount; i++ {

		go startWorker(i)
	}
}

func startWorker(id int) {
	utils.Logger.Info(
		"Worker iniciado",
		"worker_id", id,
	)

	for notification := range EmailQueue {

		start := time.Now()

		utils.Logger.Infof(
			"[WORKER %d] Processando email para %s",
			id,
			notification.To,
		)

		err := services.SendEmailWithRetry(notification)

		if err != nil {
			utils.Logger.Errorf(
				"[WORKER %d] Falha ao enviar email: %v",
				id,
				err,
			)

			continue
		}

		utils.Logger.Infof(
			"[WORKER %d] finalizou o processamento em %d ms",
			id,
			time.Since(start).Milliseconds(),
		)
	}
}

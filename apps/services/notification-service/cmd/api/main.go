package main

import (
	"notification-service/internal/config"
	"notification-service/internal/handlers"
	"notification-service/internal/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	workers.StartEmailWorker()

	router := gin.Default()

	router.POST(
		"/notifications/email",
		handlers.SendEmailHandler,
	)

	router.Run(":" + config.GetEnv("APP_PORT"))
}

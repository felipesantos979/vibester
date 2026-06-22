package main

import (
	"notification-service/internal/config"
	"notification-service/internal/handlers"
	"notification-service/internal/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	workers.StartEmailWorkers(5)

	router := gin.Default()

	router.POST(
		"/notifications/email",
		handlers.SendEmailHandler,
	)

	router.POST(
		"/notifications/reset-password",
		handlers.SendRequestPasswordHandler,
	)

	router.POST(
		"/notifications/welcome",
		handlers.SendWelcomeHandler,
	)

	router.POST(
		"/notifications/2fa",
		handlers.SendTwoFactorHandler,
	)

	router.Run(":" + config.GetEnv("APP_PORT"))
}

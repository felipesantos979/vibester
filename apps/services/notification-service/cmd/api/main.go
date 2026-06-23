package main

import (
	"notification-service/internal/config"
	"notification-service/internal/database"
	"notification-service/internal/handlers"
	"notification-service/internal/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	err := database.Connect()

	if err != nil {
		panic(err)
	}

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

	router.POST(
		"/notifications/2fa/validate",
		handlers.ValidateTwoFactorHandler,
	)

	router.Run(":" + config.GetEnv("APP_PORT"))
}

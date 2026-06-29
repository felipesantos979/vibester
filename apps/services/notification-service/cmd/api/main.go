package main

import (
	"net/http"
	"notification-service/internal/config"
	"notification-service/internal/database"
	"notification-service/internal/handlers"
	internalKafka "notification-service/internal/kafka"
	"notification-service/internal/workers"

	_ "notification-service/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title			Notification Service API
// @version		1.0
// @description	Documentação da API do serviço de notificações do Vibester (emails: genérico, recuperação de senha, boas-vindas e 2FA).
// @BasePath		/
func main() {
	config.LoadEnv()

	err := database.Connect()

	if err != nil {
		panic(err)
	}

	if err := database.Migrate(); err != nil {
		panic(err)
	}

	workers.StartEmailWorkers(5)

	internalKafka.StartConsumers(config.GetKafkaBrokers())

	router := gin.Default()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

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

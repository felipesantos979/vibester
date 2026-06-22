package main

import (
	"notification-service/internal/config"
	"notification-service/internal/handlers"
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

	workers.StartEmailWorkers(5)

	router := gin.Default()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

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

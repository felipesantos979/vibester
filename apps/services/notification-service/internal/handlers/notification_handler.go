package handlers

import (
	"net/http"
	"notification-service/internal/models"
	"notification-service/internal/render"
	"notification-service/internal/workers"

	"github.com/gin-gonic/gin"
)

func SendEmailHandler(c *gin.Context) {
	var notification models.Notification

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON inválido",
		})
		return
	}

	workers.EmailQueue <- notification

	c.JSON(http.StatusOK, gin.H{
		"message": "Email enviado para processamento",
	})
}

func SendRequestPasswordHandler(c *gin.Context) {
	var notification models.Notification

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON Inválido",
		})

		return
	}

	htmlBody, err := render.ParseTemplate(
		"../../internal/templates/reset_password.html",
		models.ResetPasswordData{
			Name:      notification.Name,
			ResetLink: notification.ResetLink,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	workers.EmailQueue <- models.Notification{
		To:      notification.To,
		Subject: "Recuperação de Senha",
		Message: htmlBody,
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Email de recuperação enviado para fila",
	})
}

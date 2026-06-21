package handlers

import (
	"net/http"
	"notification-service/internal/models"
	"notification-service/internal/services"

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

	go services.SendEmail(
		notification.To,
		notification.Subject,
		notification.Message,
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Email enviado para processamento",
	})
}

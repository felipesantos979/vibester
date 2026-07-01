package handlers

import (
	"net/http"
	"notification-service/internal/helpers"
	"notification-service/internal/models"
	"notification-service/internal/render"
	"notification-service/internal/repository"
	"notification-service/internal/security"
	"notification-service/internal/service"
	"notification-service/internal/workers"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

var notificationFeedService = service.NewNotificationFeedService()

// SendEmailHandler godoc
//
//	@Summary		Enviar email genérico
//	@Description	Enfileira um email genérico para processamento assíncrono.
//	@Tags			Notifications
//	@Accept			json
//	@Produce		json
//	@Param			notification	body		models.Notification	true	"Dados do email (to, subject, message)"
//	@Success		200				{object}	map[string]string	"Email enviado para processamento"
//	@Failure		400				{object}	map[string]string	"JSON inválido"
//	@Router			/notifications/email [post]
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

// SendRequestPasswordHandler godoc
//
//	@Summary		Enviar email de recuperação de senha
//	@Description	Renderiza o template de recuperação de senha e enfileira o email.
//	@Tags			Notifications
//	@Accept			json
//	@Produce		json
//	@Param			notification	body		models.Notification	true	"Dados (to, name, reset_link)"
//	@Success		202				{object}	map[string]string	"Email de recuperação enviado para fila"
//	@Failure		400				{object}	map[string]string	"JSON inválido"
//	@Failure		500				{object}	map[string]string	"Erro ao renderizar template"
//	@Router			/notifications/reset-password [post]
func SendRequestPasswordHandler(c *gin.Context) {
	var notification models.Notification

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON Inválido",
		})

		return
	}

	htmlBody, err := render.ParseTemplate(
		helpers.GetTemplatePath("reset_password.html"),
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

// SendWelcomeHandler godoc
//
//	@Summary		Enviar email de boas-vindas
//	@Description	Renderiza o template de boas-vindas e enfileira o email.
//	@Tags			Notifications
//	@Accept			json
//	@Produce		json
//	@Param			notification	body		models.Notification	true	"Dados (to, name)"
//	@Success		202				{object}	map[string]string	"Email de boas-vindas enviado"
//	@Failure		400				{object}	map[string]string	"JSON inválido"
//	@Failure		500				{object}	map[string]string	"Erro ao renderizar template"
//	@Router			/notifications/welcome [post]
func SendWelcomeHandler(c *gin.Context) {
	var notification models.Notification

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON inválido",
		})

		return
	}

	htmlBody, err := render.ParseTemplate(
		helpers.GetTemplatePath("welcome.html"),
		models.WelcomeEmailData{
			Name:         notification.Name,
			PlatformLink: "https://vibester.com.br",
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
		Subject: "Seja bem vindo ao Vibester!",
		Message: htmlBody,
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Email de boas-vindas enviado",
	})
}

// SendTwoFactorHandler godoc
//
//	@Summary		Enviar código 2FA
//	@Description	Gera um código de autenticação de dois fatores, renderiza o template e enfileira o email.
//	@Tags			Notifications
//	@Accept			json
//	@Produce		json
//	@Param			notification	body		models.Notification	true	"Dados (to, name)"
//	@Success		202				{object}	map[string]string	"Código 2FA enviado"
//	@Failure		400				{object}	map[string]string	"JSON inválido"
//	@Failure		500				{object}	map[string]string	"Erro ao renderizar template"
//	@Router			/notifications/2fa [post]
func SendTwoFactorHandler(c *gin.Context) {

	var notification models.Notification

	if err := c.ShouldBindJSON(&notification); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON Inválido",
		})

		return
	}

	code := security.GenerateTwoFactorCode()

	err := repository.SaveTwoFactorCode(
		notification.To,
		code,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar código",
		})

		return
	}

	htmlBody, err := render.ParseTemplate(
		helpers.GetTemplatePath("two_factor_code.html"),
		models.TwoFactorData{
			Name: notification.Name,
			Code: code,
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
		Subject: "Aqui está o seu código de autenticação",
		Message: htmlBody,
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Código 2FA enviado",
	})
}

// ValidateTwoFactorHandler godoc
//
//	@Summary		Validar código 2FA
//	@Description	Valida um código de dois fatores e o marca como utilizado.
//	@Tags			Notifications
//	@Accept			json
//	@Produce		json
//	@Param			request	body		models.ValidateTwoFactorRequest	true	"Email e código 2FA"
//	@Success		200		{object}	map[string]bool					"Código válido"
//	@Failure		400		{object}	map[string]string				"JSON inválido"
//	@Failure		401		{object}	map[string]bool					"Código inválido ou expirado"
//	@Failure		500		{object}	map[string]string				"Erro interno"
//	@Router			/notifications/2fa/validate [post]
func ValidateTwoFactorHandler(c *gin.Context) {

	var request models.ValidateTwoFactorRequest

	if err := c.ShouldBindJSON(&request); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "JSON inválido",
		})

		return
	}

	valid, err := repository.ValidateTwoFactorCode(
		request.Email,
		request.Code,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao validar código",
		})

		return
	}

	if !valid {

		c.JSON(http.StatusUnauthorized, gin.H{
			"valid": false,
		})

		return
	}

	err = repository.MarkTwoFactorCodeAsUsed(
		request.Email,
		request.Code,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao invalidar código",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"valid": true,
	})
}

// ListNotificationsHandler godoc
//
//	@Summary		Listar notificações
//	@Description	Lista as notificações (curtidas, comentários e seguidores) de um usuário, agrupadas e ordenadas da mais recente para a mais antiga.
//	@Tags			Notifications
//	@Produce		json
//	@Param			userId	path		string	true	"ID do usuário destinatário"
//	@Param			limit	query		int		false	"Quantidade máxima de grupos retornados (padrão 50)"
//	@Param			before	query		string	false	"Cursor de paginação (RFC3339) — retorna notificações anteriores a essa data"
//	@Success		200		{object}	models.NotificationListResponse
//	@Failure		400		{object}	map[string]string	"Parâmetros inválidos"
//	@Failure		500		{object}	map[string]string	"Erro interno"
//	@Router			/notifications/{userId} [get]
func ListNotificationsHandler(c *gin.Context) {
	userId := c.Param("userId")

	limit := 50
	if raw := c.Query("limit"); raw != "" {
		parsed, err := strconv.Atoi(raw)
		if err != nil || parsed <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "parâmetro limit inválido",
			})
			return
		}
		limit = parsed
	}

	var before *time.Time
	if raw := c.Query("before"); raw != "" {
		parsed, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "parâmetro before inválido, use RFC3339",
			})
			return
		}
		before = &parsed
	}

	feed, err := notificationFeedService.BuildFeed(userId, limit, before)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro ao buscar notificações",
		})
		return
	}

	c.JSON(http.StatusOK, feed)
}

// UnreadCountHandler godoc
//
//	@Summary		Contar notificações não vistas
//	@Description	Retorna quantos grupos de notificação ainda não foram vistos por um usuário.
//	@Tags			Notifications
//	@Produce		json
//	@Param			userId	path		string	true	"ID do usuário destinatário"
//	@Success		200		{object}	map[string]int
//	@Failure		500		{object}	map[string]string	"Erro interno"
//	@Router			/notifications/{userId}/unread-count [get]
func UnreadCountHandler(c *gin.Context) {
	userId := c.Param("userId")

	count, err := notificationFeedService.CountUnreadGroups(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro ao contar notificações",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": count,
	})
}

// MarkReadHandler godoc
//
//	@Summary		Marcar notificações como lidas
//	@Description	Marca todas as notificações não lidas de um usuário como lidas.
//	@Tags			Notifications
//	@Produce		json
//	@Param			userId	path		string	true	"ID do usuário destinatário"
//	@Success		200		{object}	map[string]int64
//	@Failure		500		{object}	map[string]string	"Erro interno"
//	@Router			/notifications/{userId}/read [patch]
func MarkReadHandler(c *gin.Context) {
	userId := c.Param("userId")

	updated, err := repository.MarkAllReadByRecipient(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "erro ao marcar notificações como lidas",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"updated": updated,
	})
}

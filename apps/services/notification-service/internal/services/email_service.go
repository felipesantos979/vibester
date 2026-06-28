package services

import (
	"errors"
	"fmt"
	"notification-service/internal/config"
	"notification-service/internal/models"
	"notification-service/internal/utils"
	"strconv"
	"time"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, subject, message string) error {
	utils.Logger.Infof(
		"📤 Enviando email para %s",
		to,
	)

	port, err := strconv.Atoi(
		config.GetEnv("SMTP_PORT"),
	)

	if err != nil {
		return err
	}

	m := gomail.NewMessage()

	m.SetAddressHeader(
		"From",
		config.GetEnv("SMTP_EMAIL"),
		config.GetEnv("SMTP_FROM_NAME"),
	)

	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", message)

	d := gomail.NewDialer(
		config.GetEnv("SMTP_HOST"),
		port,
		config.GetEnv("SMTP_EMAIL"),
		config.GetEnv("SMTP_PASSWORD"),
	)

	err = d.DialAndSend(m)

	if err != nil {
		utils.Logger.Errorf(
			"❌ Falha ao enviar email: %v",
			err,
		)

		return err
	}

	utils.Logger.Info(
		fmt.Sprintf("✅ Email enviado para %s", to),
	)

	return nil
}

func SendEmailWithRetry(notification models.Notification) error {
	maxRetries := 3

	for attempt := 1; attempt <= maxRetries; attempt++ {
		err := SendEmail(
			notification.To,
			notification.Subject,
			notification.Message,
		)

		if err == nil {
			utils.Logger.Info(
				"Email enviado com sucesso",
				"attempt", attempt,
				"to", notification.To,
			)

			return nil
		}

		utils.Logger.Error(
			"Erro ao enviar email",
			"attempt", attempt,
			"error", err,
		)

		time.Sleep(2 * time.Second)
	}

	return errors.New("falha ao enviar email após retries")
}

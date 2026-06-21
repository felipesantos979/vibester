package services

import (
	"notification-service/internal/config"
	"notification-service/internal/utils"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, subject, message string) error {
	utils.Logger.Info(
		"Enviando email",
		"to", to,
		"subject", subject,
	)

	m := gomail.NewMessage()

	m.SetHeader("From", config.GetEnv("SMTP_EMAIl"))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", message)

	d := gomail.NewDialer(
		config.GetEnv("SMTP_HOST"),
		587,
		config.GetEnv("SMTP_EMAIL"),
		config.GetEnv("SMTP_PASSWORD"),
	)

	err := d.DialAndSend(m)

	if err != nil {
		utils.Logger.Error(
			"Erro ao enviar email",
			"error", err,
		)
		return err
	}

	utils.Logger.Info(
		"Email enviado com sucesso",
		"to", to,
	)

	return nil
}

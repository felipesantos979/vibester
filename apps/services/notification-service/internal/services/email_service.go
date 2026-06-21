package services

import (
	"notification-service/internal/config"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, subject, message string) error {
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

	return d.DialAndSend(m)
}

package services

import (
	"notification-service/internal/models"
	"testing"
)

func TestSendEmail_InvalidPort(t *testing.T) {
	t.Setenv("SMTP_PORT", "not-a-number")

	err := SendEmail("dest@example.com", "Subject", "Message")

	if err == nil {
		t.Fatal("expected error when SMTP_PORT is not a valid number, got nil")
	}
}

func TestSendEmail_DialFailure(t *testing.T) {
	// Porta 1 em localhost não tem nenhum servidor SMTP escutando,
	// então DialAndSend deve falhar rapidamente com "connection refused".
	t.Setenv("SMTP_PORT", "1")
	t.Setenv("SMTP_HOST", "localhost")
	t.Setenv("SMTP_EMAIL", "sender@example.com")
	t.Setenv("SMTP_FROM_NAME", "Vibester")
	t.Setenv("SMTP_PASSWORD", "fake-password")

	err := SendEmail("dest@example.com", "Subject", "Message")

	if err == nil {
		t.Fatal("expected error when SMTP server is unreachable, got nil")
	}
}

func TestSendEmailWithRetry_FailsAfterMaxRetries(t *testing.T) {
	t.Setenv("SMTP_PORT", "not-a-number")

	notification := models.Notification{
		To:      "dest@example.com",
		Subject: "Subject",
		Message: "Message",
	}

	err := SendEmailWithRetry(notification)

	if err == nil {
		t.Fatal("expected error after exhausting retries, got nil")
	}
	if err.Error() != "falha ao enviar email após retries" {
		t.Errorf("unexpected error message: %v", err)
	}
}

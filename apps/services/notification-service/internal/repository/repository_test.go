//go:build integration

package repository

import (
	"context"
	"fmt"
	"notification-service/internal/database"
	"os"
	"testing"
	"time"
)

func TestMain(m *testing.M) {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_NAME", "notification_test"),
	)
	os.Setenv("DB_USER", getEnv("DB_USER", "postgres"))
	os.Setenv("DB_PASSWORD", getEnv("DB_PASSWORD", "postgres"))
	os.Setenv("DB_HOST", getEnv("DB_HOST", "localhost"))
	os.Setenv("DB_PORT", getEnv("DB_PORT", "5432"))
	os.Setenv("DB_NAME", getEnv("DB_NAME", "notification_test"))
	_ = dsn

	if err := database.Connect(); err != nil {
		fmt.Printf("SKIP: banco de dados indisponível: %v\n", err)
		os.Exit(0)
	}

	if _, err := database.DB.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS two_factor_codes (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			email VARCHAR(255) NOT NULL,
			code VARCHAR(10) NOT NULL,
			expires_at TIMESTAMP NOT NULL,
			used BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW()
		);
		CREATE TABLE IF NOT EXISTS notifications (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			type VARCHAR(50) NOT NULL,
			recipient_id VARCHAR(255) NOT NULL,
			actor_id VARCHAR(255) NOT NULL,
			ref_id VARCHAR(255) NOT NULL,
			content TEXT,
			read BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW()
		);
	`); err != nil {
		fmt.Printf("SKIP: falha ao criar tabelas: %v\n", err)
		os.Exit(0)
	}

	code := m.Run()

	database.DB.Exec(context.Background(), "TRUNCATE two_factor_codes, notifications")
	database.DB.Close()
	os.Exit(code)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func TestSaveAndValidateTwoFactorCode(t *testing.T) {
	email := fmt.Sprintf("test-%d@example.com", time.Now().UnixNano())
	code := "482931"

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	if err := SaveTwoFactorCode(email, code); err != nil {
		t.Fatalf("SaveTwoFactorCode: %v", err)
	}

	valid, err := ValidateTwoFactorCode(email, code)
	if err != nil {
		t.Fatalf("ValidateTwoFactorCode: %v", err)
	}
	if !valid {
		t.Error("expected code to be valid")
	}
}

func TestValidateTwoFactorCode_WrongCode(t *testing.T) {
	email := fmt.Sprintf("test-%d@example.com", time.Now().UnixNano())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	if err := SaveTwoFactorCode(email, "123456"); err != nil {
		t.Fatalf("SaveTwoFactorCode: %v", err)
	}

	valid, err := ValidateTwoFactorCode(email, "000000")
	if err != nil {
		t.Fatalf("ValidateTwoFactorCode: %v", err)
	}
	if valid {
		t.Error("expected code to be invalid with wrong code")
	}
}

func TestMarkTwoFactorCodeAsUsed(t *testing.T) {
	email := fmt.Sprintf("test-%d@example.com", time.Now().UnixNano())
	code := "654321"

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	if err := SaveTwoFactorCode(email, code); err != nil {
		t.Fatalf("SaveTwoFactorCode: %v", err)
	}

	if err := MarkTwoFactorCodeAsUsed(email, code); err != nil {
		t.Fatalf("MarkTwoFactorCodeAsUsed: %v", err)
	}

	valid, err := ValidateTwoFactorCode(email, code)
	if err != nil {
		t.Fatalf("ValidateTwoFactorCode after mark used: %v", err)
	}
	if valid {
		t.Error("expected code to be invalid after being marked as used")
	}
}

func TestValidateTwoFactorCode_UnknownEmail(t *testing.T) {
	valid, err := ValidateTwoFactorCode("nonexistent@example.com", "000000")
	if err != nil {
		t.Fatalf("ValidateTwoFactorCode: %v", err)
	}
	if valid {
		t.Error("expected false for unknown email")
	}
}

func TestCreateNotification(t *testing.T) {
	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE actor_id = 'test-actor'")
	})

	if err := CreateNotification("like", "recipient-1", "test-actor", "post-1", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}

	var count int
	err := database.DB.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM notifications WHERE actor_id = 'test-actor'",
	).Scan(&count)
	if err != nil {
		t.Fatalf("query count: %v", err)
	}
	if count != 1 {
		t.Errorf("expected 1 notification, got %d", count)
	}
}

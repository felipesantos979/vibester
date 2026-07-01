//go:build integration

package database

import (
	"context"
	"notification-service/internal/config"
	"os"
	"testing"
)

func getEnv(key, fallback string) string {
	if v := config.GetEnv(key); v != "" {
		return v
	}
	return fallback
}

func TestConnect_Success(t *testing.T) {
	os.Setenv("DB_USER", getEnv("DB_USER", "postgres"))
	os.Setenv("DB_PASSWORD", getEnv("DB_PASSWORD", "postgres"))
	os.Setenv("DB_HOST", getEnv("DB_HOST", "localhost"))
	os.Setenv("DB_PORT", getEnv("DB_PORT", "5432"))
	os.Setenv("DB_NAME", getEnv("DB_NAME", "notification_test"))

	if err := Connect(); err != nil {
		t.Skipf("SKIP: banco de dados indisponível: %v", err)
	}

	if DB == nil {
		t.Fatal("expected DB pool to be set after Connect()")
	}

	if err := DB.Ping(context.Background()); err != nil {
		t.Fatalf("expected to ping the database successfully, got error: %v", err)
	}
}

func TestMigrate_CreatesTables(t *testing.T) {
	os.Setenv("DB_USER", getEnv("DB_USER", "postgres"))
	os.Setenv("DB_PASSWORD", getEnv("DB_PASSWORD", "postgres"))
	os.Setenv("DB_HOST", getEnv("DB_HOST", "localhost"))
	os.Setenv("DB_PORT", getEnv("DB_PORT", "5432"))
	os.Setenv("DB_NAME", getEnv("DB_NAME", "notification_test"))

	if err := Connect(); err != nil {
		t.Skipf("SKIP: banco de dados indisponível: %v", err)
	}

	if err := Migrate(); err != nil {
		t.Fatalf("expected Migrate() to succeed, got error: %v", err)
	}

	// Migrate deve ser idempotente (usa CREATE TABLE/INDEX IF NOT EXISTS)
	if err := Migrate(); err != nil {
		t.Fatalf("expected second Migrate() call to succeed (idempotent), got error: %v", err)
	}

	var exists bool
	err := DB.QueryRow(context.Background(), `
		SELECT EXISTS (
			SELECT FROM information_schema.tables
			WHERE table_name = 'notifications'
		)
	`).Scan(&exists)
	if err != nil {
		t.Fatalf("failed to check if notifications table exists: %v", err)
	}
	if !exists {
		t.Error("expected notifications table to exist after Migrate()")
	}
}

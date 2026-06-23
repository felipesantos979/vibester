package database

import (
	"context"
	"fmt"
	"notification-service/internal/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect() error {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		config.GetEnv("DB_USER"),
		config.GetEnv("DB_PASSWORD"),
		config.GetEnv("DB_HOST"),
		config.GetEnv("DB_PORT"),
		config.GetEnv("DB_NAME"),
	)

	pool, err := pgxpool.New(context.Background(), dsn)

	if err != nil {
		return err
	}

	DB = pool

	return nil
}

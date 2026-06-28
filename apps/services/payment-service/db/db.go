package db

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type DB struct {
	conn *sql.DB
}

type Payment struct {
	ID         int64
	BillID     string
	ExternalID string
	Amount     int
	Status     string
}

func NewDB(databaseURL string) (*DB, error) {
	conn, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := conn.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{conn: conn}, nil
}

func (d *DB) InsertPayment(billID, externalID string, amount int) error {
	return d.InsertPaymentContext(context.Background(), billID, externalID, amount)
}

func (d *DB) InsertPaymentContext(ctx context.Context, billID, externalID string, amount int) error {
	query := `
		INSERT INTO payments (bill_id, external_id, amount, status)
		VALUES ($1, $2, $3, 'PENDING')
		RETURNING id
	`
	var id int64
	err := d.conn.QueryRowContext(ctx, query, billID, externalID, amount).Scan(&id)
	if err != nil {
		return fmt.Errorf("failed to insert payment: %w", err)
	}
	return nil
}

func (d *DB) Close() error {
	return d.conn.Close()
}

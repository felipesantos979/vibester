package database

import "context"

func Migrate() error {
	_, err := DB.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS notifications (
			id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
			type         VARCHAR(50) NOT NULL,
			recipient_id VARCHAR(255) NOT NULL,
			actor_id     VARCHAR(255) NOT NULL,
			ref_id       VARCHAR(255) NOT NULL,
			content      TEXT,
			read         BOOLEAN     DEFAULT false,
			created_at   TIMESTAMP   DEFAULT NOW()
		)
	`)
	return err
}

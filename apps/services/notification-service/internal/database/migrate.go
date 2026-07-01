package database

import "context"

func Migrate() error {
	_, err := DB.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS notifications (
			id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
			type         VARCHAR(50)  NOT NULL,
			recipient_id VARCHAR(255) NOT NULL,
			actor_id     VARCHAR(255) NOT NULL,
			ref_id       VARCHAR(255) NOT NULL,
			content      TEXT,
			read         BOOLEAN      DEFAULT false,
			created_at   TIMESTAMP    DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS two_factor_codes (
			id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
			email      VARCHAR(255) NOT NULL,
			code       VARCHAR(10)  NOT NULL,
			expires_at TIMESTAMP    NOT NULL,
			used       BOOLEAN      DEFAULT false,
			created_at TIMESTAMP    DEFAULT NOW()
		);

		CREATE INDEX IF NOT EXISTS idx_two_factor_codes_email_used
			ON two_factor_codes (email, used, expires_at);

		CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read_created
			ON notifications (recipient_id, read, created_at DESC);

		CREATE INDEX IF NOT EXISTS idx_notifications_recipient_type_ref
			ON notifications (recipient_id, type, ref_id);
	`)
	return err
}

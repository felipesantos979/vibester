package repository

import (
	"context"
	"notification-service/internal/database"
)

func SaveTwoFactorCode(
	email string,
	code string,
) error {

	query := `
		INSERT INTO two_factor_codes (
			email,
			code,
			expires_at
		)
		VALUES (
			$1,
			$2,
			NOW() + INTERVAL '5 minutes'
		)
	`

	_, err := database.DB.Exec(
		context.Background(),
		query,
		email,
		code,
	)

	return err
}

func ValidateTwoFactorCode(
	email string,
	code string,
) (bool, error) {

	query := `
		SELECT EXISTS (
			SELECT 1
			FROM two_factor_codes
			WHERE email = $1
			AND code = $2
			AND used = false
			AND expires_at > NOW()
		)
	`

	var exists bool

	err := database.DB.QueryRow(
		context.Background(),
		query,
		email,
		code,
	).Scan(&exists)

	return exists, err
}

func MarkTwoFactorCodeAsUsed(
	email string,
	code string,
) error {

	query := `
		UPDATE two_factor_codes
		SET used = true
		WHERE email = $1
		AND code = $2
		AND used = false
	`

	_, err := database.DB.Exec(
		context.Background(),
		query,
		email,
		code,
	)

	return err
}

package entities

import "time"

type TwoFactorCode struct {
	Email     string
	Code      string
	ExpiresAt time.Time
	Used      bool
}

package security

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateTwoFactorCode() string {
	rand.Seed(time.Now().UnixNano())

	code := rand.Intn(90000) + 10000

	return fmt.Sprintf("%05d", code)
}

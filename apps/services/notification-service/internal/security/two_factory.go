package security

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func GenerateTwoFactorCode() string {
	n, err := rand.Int(rand.Reader, big.NewInt(900_000))
	if err != nil {
		return "000000"
	}
	return fmt.Sprintf("%06d", n.Int64()+100_000)
}

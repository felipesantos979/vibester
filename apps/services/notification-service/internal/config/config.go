package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Erro ao carregar .env")
	}
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

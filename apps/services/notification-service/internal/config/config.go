package config

import (
	"log"
	"os"
	"strings"

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

func GetKafkaBrokers() []string {
	return strings.Split(GetEnv("KAFKA_BROKERS"), ",")
}

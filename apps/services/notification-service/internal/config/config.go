package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("[config] .env não encontrado, usando variáveis de ambiente do sistema")
	}
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

func GetEnvOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func GetKafkaBrokers() []string {
	return strings.Split(GetEnv("KAFKA_BROKERS"), ",")
}

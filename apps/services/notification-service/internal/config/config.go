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

func GetKafkaBrokers() []string {
	return strings.Split(GetEnv("KAFKA_BROKERS"), ",")
}

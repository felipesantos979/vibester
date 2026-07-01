package clients

import (
	"net/http"
	"notification-service/internal/config"
	"strconv"
	"time"
)

// newHTTPClient cria um client HTTP com timeout curto para chamadas
// internas entre serviços (enriquecimento de notificações). Uma falha ou
// timeout aqui nunca deve derrubar a resposta de notificações inteira — os
// chamadores tratam erro como "sem dado, mostrar fallback".
func newHTTPClient() *http.Client {
	ms, err := strconv.Atoi(config.GetEnvOrDefault("HTTP_CLIENT_TIMEOUT_MS", "5000"))
	if err != nil || ms <= 0 {
		ms = 5000
	}

	return &http.Client{Timeout: time.Duration(ms) * time.Millisecond}
}

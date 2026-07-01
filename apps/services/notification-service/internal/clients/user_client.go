package clients

import (
	"context"
	"encoding/json"
	"net/http"
	"notification-service/internal/config"
	"notification-service/internal/models"
)

type UserClient struct {
	baseURL string
	http    *http.Client
}

func NewUserClient() *UserClient {
	return &UserClient{
		baseURL: config.GetEnvOrDefault("USER_SERVICE_URL", "http://user-service:3003"),
		http:    newHTTPClient(),
	}
}

type userProfileResponse struct {
	AccountID string `json:"accountId"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	AvatarUrl string `json:"avatarUrl"`
}

// GetProfile busca o perfil de um usuário no user-service para enriquecer
// uma notificação com nome/avatar. Retorna (nil, nil) — não um erro —
// quando o perfil não existe (ex: conta deletada) ou a chamada falha/
// expira, para que o chamador exiba um fallback em vez de derrubar a
// resposta inteira de notificações.
func (c *UserClient) GetProfile(ctx context.Context, accountId string) (*models.ActorSummary, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		c.baseURL+"/users/profile/"+accountId,
		nil,
	)
	if err != nil {
		return nil, nil
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, nil
	}

	var profile userProfileResponse
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, nil
	}

	return &models.ActorSummary{
		AccountID: profile.AccountID,
		Name:      profile.Name,
		Username:  profile.Username,
		AvatarUrl: profile.AvatarUrl,
	}, nil
}

package clients

import (
	"context"
	"encoding/json"
	"net/http"
	"notification-service/internal/config"
	"notification-service/internal/models"
)

type PostClient struct {
	baseURL string
	http    *http.Client
}

func NewPostClient() *PostClient {
	return &PostClient{
		baseURL: config.GetEnvOrDefault("POST_SERVICE_URL", "http://post-service:3000"),
		http:    newHTTPClient(),
	}
}

type postResponse struct {
	PostID    string   `json:"postId"`
	ImageUrls []string `json:"imageUrls"`
	Caption   string   `json:"caption"`
	IsDeleted bool     `json:"isDeleted"`
}

// GetPost busca um post no post-service para enriquecer uma notificação de
// curtida/comentário com uma miniatura e legenda. Retorna (nil, nil) — não
// um erro — quando o post não existe ou a chamada falha/expira, para que o
// chamador exiba um fallback em vez de derrubar a resposta inteira.
//
// Um post apagado (soft delete) ainda retorna 200 com isDeleted: true — o
// chamador precisa checar esse campo explicitamente, não só o status HTTP.
func (c *PostClient) GetPost(ctx context.Context, postId string) (*models.PostSummary, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		c.baseURL+"/posts/"+postId,
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

	var post postResponse
	if err := json.NewDecoder(resp.Body).Decode(&post); err != nil {
		return nil, nil
	}

	imageUrl := ""
	if len(post.ImageUrls) > 0 {
		imageUrl = post.ImageUrls[0]
	}

	caption := post.Caption
	if post.IsDeleted {
		caption = "Publicação removida"
	}

	return &models.PostSummary{
		PostID:    post.PostID,
		ImageUrl:  imageUrl,
		Caption:   caption,
		IsDeleted: post.IsDeleted,
	}, nil
}

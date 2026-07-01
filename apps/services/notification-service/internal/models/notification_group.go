package models

import "time"

// NotificationRow representa uma linha crua da tabela notifications.
type NotificationRow struct {
	ID          string
	Type        string
	RecipientID string
	ActorID     string
	RefID       string
	Content     string
	Read        bool
	CreatedAt   time.Time
}

// NotificationGroup representa várias NotificationRow agrupadas (ex: várias
// curtidas no mesmo post viram 1 grupo). Produzido em memória, sem I/O.
type NotificationGroup struct {
	Key         string
	Type        string
	RefID       string
	ActorID     string   // ator mais recente do grupo (linha mais nova)
	ActorIDs    []string // todos os atores distintos do grupo, mais recente primeiro
	OthersCount int
	TotalCount  int
	Content     string // usado em comentários (texto do comentário mais recente)
	Read        bool
	CreatedAt   time.Time
}

// ActorSummary é o resultado enriquecido de um ator (buscado no user-service).
type ActorSummary struct {
	AccountID string `json:"accountId"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	AvatarUrl string `json:"avatarUrl"`
}

// PostSummary é o resultado enriquecido de um post (buscado no post-service).
type PostSummary struct {
	PostID    string `json:"postId"`
	ImageUrl  string `json:"imageUrl"`
	Caption   string `json:"caption"`
	IsDeleted bool   `json:"isDeleted"`
}

// NotificationGroupResponse é o formato retornado pela API para cada grupo.
type NotificationGroupResponse struct {
	ID          string        `json:"id"`
	Type        string        `json:"type"`
	RefID       string        `json:"refId,omitempty"`
	OthersCount int           `json:"othersCount"`
	TotalCount  int           `json:"totalCount"`
	Content     string        `json:"content,omitempty"`
	Read        bool          `json:"read"`
	CreatedAt   time.Time     `json:"createdAt"`
	Actor       *ActorSummary `json:"actor"`
	Post        *PostSummary  `json:"post"`
}

// NotificationListResponse é o corpo de resposta de GET /notifications/:userId.
type NotificationListResponse struct {
	Items      []NotificationGroupResponse `json:"items"`
	NextCursor *time.Time                  `json:"nextCursor"`
}

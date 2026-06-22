package models

// Notification representa o payload de uma notificação por email.
type Notification struct {
	Name      string `json:"name" example:"João Silva"`
	To        string `json:"to" example:"joao@email.com"`
	Subject   string `json:"subject" example:"Assunto do email"`
	Message   string `json:"message" example:"Conteúdo do email"`
	ResetLink string `json:"reset_link" example:"https://vibester.com.br/reset/abc123"`
}

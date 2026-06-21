package models

type Notification struct {
	Name      string `json:"name"`
	To        string `json:"to"`
	Subject   string `json:"subject"`
	Message   string `json:"message"`
	ResetLink string `json:"reset_link"`
}

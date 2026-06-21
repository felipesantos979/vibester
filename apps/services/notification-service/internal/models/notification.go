package models

type Notification struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

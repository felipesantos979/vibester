package models

type ValidateTwoFactorRequest struct {
	Email string `json:"email" example:"joao@email.com"`
	Code  string `json:"code"  example:"482931"`
}

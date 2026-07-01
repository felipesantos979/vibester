package clients

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUserClient_GetProfile_Success(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"accountId":"u1","name":"João Silva","username":"joaosilva","avatarUrl":"https://example.com/a.jpg"}`))
	}))
	defer server.Close()

	t.Setenv("USER_SERVICE_URL", server.URL)
	client := NewUserClient()

	profile, err := client.GetProfile(context.Background(), "u1")

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if profile == nil {
		t.Fatal("expected a profile summary, got nil")
	}
	if profile.AccountID != "u1" || profile.Name != "João Silva" || profile.Username != "joaosilva" {
		t.Errorf("unexpected profile summary: %+v", profile)
	}
}

func TestUserClient_GetProfile_NotFound(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer server.Close()

	t.Setenv("USER_SERVICE_URL", server.URL)
	client := NewUserClient()

	profile, err := client.GetProfile(context.Background(), "missing")

	if err != nil {
		t.Fatalf("expected nil error on non-200 response (fallback behavior), got %v", err)
	}
	if profile != nil {
		t.Errorf("expected nil profile on 404, got %+v", profile)
	}
}

func TestUserClient_GetProfile_Unreachable(t *testing.T) {
	t.Setenv("USER_SERVICE_URL", "http://127.0.0.1:1")
	t.Setenv("HTTP_CLIENT_TIMEOUT_MS", "200")
	client := NewUserClient()

	profile, err := client.GetProfile(context.Background(), "u1")

	if err != nil {
		t.Fatalf("expected nil error when the service is unreachable (fallback behavior), got %v", err)
	}
	if profile != nil {
		t.Errorf("expected nil profile when the service is unreachable, got %+v", profile)
	}
}

func TestUserClient_GetProfile_InvalidJSON(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`not-json`))
	}))
	defer server.Close()

	t.Setenv("USER_SERVICE_URL", server.URL)
	client := NewUserClient()

	profile, err := client.GetProfile(context.Background(), "u1")

	if err != nil {
		t.Fatalf("expected nil error on invalid JSON (fallback behavior), got %v", err)
	}
	if profile != nil {
		t.Errorf("expected nil profile on invalid JSON, got %+v", profile)
	}
}

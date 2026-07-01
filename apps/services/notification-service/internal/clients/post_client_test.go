package clients

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPostClient_GetPost_Success(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"postId":"p1","imageUrls":["https://example.com/img.jpg"],"caption":"Legenda","isDeleted":false}`))
	}))
	defer server.Close()

	t.Setenv("POST_SERVICE_URL", server.URL)
	client := NewPostClient()

	post, err := client.GetPost(context.Background(), "p1")

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post == nil {
		t.Fatal("expected a post summary, got nil")
	}
	if post.PostID != "p1" || post.Caption != "Legenda" || post.ImageUrl != "https://example.com/img.jpg" {
		t.Errorf("unexpected post summary: %+v", post)
	}
}

func TestPostClient_GetPost_Deleted(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"postId":"p1","imageUrls":[],"caption":"Original","isDeleted":true}`))
	}))
	defer server.Close()

	t.Setenv("POST_SERVICE_URL", server.URL)
	client := NewPostClient()

	post, err := client.GetPost(context.Background(), "p1")

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if post.Caption != "Publicação removida" {
		t.Errorf("expected caption fallback for deleted post, got %q", post.Caption)
	}
	if post.ImageUrl != "" {
		t.Errorf("expected empty image url when imageUrls is empty, got %q", post.ImageUrl)
	}
}

func TestPostClient_GetPost_NotFound(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer server.Close()

	t.Setenv("POST_SERVICE_URL", server.URL)
	client := NewPostClient()

	post, err := client.GetPost(context.Background(), "missing")

	if err != nil {
		t.Fatalf("expected nil error on non-200 response (fallback behavior), got %v", err)
	}
	if post != nil {
		t.Errorf("expected nil post on 404, got %+v", post)
	}
}

func TestPostClient_GetPost_Unreachable(t *testing.T) {
	t.Setenv("POST_SERVICE_URL", "http://127.0.0.1:1")
	t.Setenv("HTTP_CLIENT_TIMEOUT_MS", "200")
	client := NewPostClient()

	post, err := client.GetPost(context.Background(), "p1")

	if err != nil {
		t.Fatalf("expected nil error when the service is unreachable (fallback behavior), got %v", err)
	}
	if post != nil {
		t.Errorf("expected nil post when the service is unreachable, got %+v", post)
	}
}

func TestPostClient_GetPost_InvalidJSON(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`not-json`))
	}))
	defer server.Close()

	t.Setenv("POST_SERVICE_URL", server.URL)
	client := NewPostClient()

	post, err := client.GetPost(context.Background(), "p1")

	if err != nil {
		t.Fatalf("expected nil error on invalid JSON (fallback behavior), got %v", err)
	}
	if post != nil {
		t.Errorf("expected nil post on invalid JSON, got %+v", post)
	}
}

package kafka

import (
	"encoding/json"
	"testing"
)

func TestUserRegisteredEventParsing(t *testing.T) {
	payload := []byte(`{
		"accountId": "acc-123",
		"email": "joao@vibester.com.br",
		"username": "joao_silva",
		"name": "João Silva"
	}`)

	var event userRegisteredEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		t.Fatalf("expected no JSON error, got %v", err)
	}

	if event.AccountId != "acc-123" {
		t.Errorf("AccountId: want acc-123, got %s", event.AccountId)
	}
	if event.Email != "joao@vibester.com.br" {
		t.Errorf("Email: want joao@vibester.com.br, got %s", event.Email)
	}
	if event.Username != "joao_silva" {
		t.Errorf("Username: want joao_silva, got %s", event.Username)
	}
	if event.Name != "João Silva" {
		t.Errorf("Name: want 'João Silva', got %s", event.Name)
	}
}

func TestPostLikedEventParsing(t *testing.T) {
	payload := []byte(`{
		"postId": "post-abc",
		"postOwnerId": "owner-xyz",
		"likedByUserId": "liker-123"
	}`)

	var event postLikedEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		t.Fatalf("expected no JSON error, got %v", err)
	}

	if event.PostId != "post-abc" {
		t.Errorf("PostId: want post-abc, got %s", event.PostId)
	}
	if event.PostOwnerId != "owner-xyz" {
		t.Errorf("PostOwnerId: want owner-xyz, got %s", event.PostOwnerId)
	}
	if event.LikedByUserId != "liker-123" {
		t.Errorf("LikedByUserId: want liker-123, got %s", event.LikedByUserId)
	}
}

func TestPostCommentedEventParsing(t *testing.T) {
	payload := []byte(`{
		"postId": "post-abc",
		"postOwnerId": "owner-xyz",
		"commentedByUserId": "commenter-999",
		"content": "Que lugar incrível!"
	}`)

	var event postCommentedEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		t.Fatalf("expected no JSON error, got %v", err)
	}

	if event.PostId != "post-abc" {
		t.Errorf("PostId: want post-abc, got %s", event.PostId)
	}
	if event.PostOwnerId != "owner-xyz" {
		t.Errorf("PostOwnerId: want owner-xyz, got %s", event.PostOwnerId)
	}
	if event.CommentedByUserId != "commenter-999" {
		t.Errorf("CommentedByUserId: want commenter-999, got %s", event.CommentedByUserId)
	}
	if event.Content != "Que lugar incrível!" {
		t.Errorf("Content: want 'Que lugar incrível!', got %s", event.Content)
	}
}

func TestUserFollowedEventParsing(t *testing.T) {
	payload := []byte(`{
		"followerId": "follower-aaa",
		"followingId": "following-bbb"
	}`)

	var event userFollowedEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		t.Fatalf("expected no JSON error, got %v", err)
	}

	if event.FollowerId != "follower-aaa" {
		t.Errorf("FollowerId: want follower-aaa, got %s", event.FollowerId)
	}
	if event.FollowingId != "following-bbb" {
		t.Errorf("FollowingId: want following-bbb, got %s", event.FollowingId)
	}
}

func TestUserRegisteredEventInvalidJSON(t *testing.T) {
	payload := []byte(`not valid json`)
	var event userRegisteredEvent
	if err := json.Unmarshal(payload, &event); err == nil {
		t.Error("expected JSON error for invalid payload, got nil")
	}
}

func TestPostLikedEventMissingFields(t *testing.T) {
	payload := []byte(`{}`)
	var event postLikedEvent
	if err := json.Unmarshal(payload, &event); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if event.PostId != "" || event.PostOwnerId != "" || event.LikedByUserId != "" {
		t.Error("expected empty strings for missing JSON fields")
	}
}

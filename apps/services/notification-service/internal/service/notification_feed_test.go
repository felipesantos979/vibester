//go:build integration

package service

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"notification-service/internal/database"
	"notification-service/internal/repository"
	"os"
	"testing"
	"time"
)

func getFeedTestEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func TestMain(m *testing.M) {
	os.Setenv("DB_USER", getFeedTestEnv("DB_USER", "postgres"))
	os.Setenv("DB_PASSWORD", getFeedTestEnv("DB_PASSWORD", "postgres"))
	os.Setenv("DB_HOST", getFeedTestEnv("DB_HOST", "localhost"))
	os.Setenv("DB_PORT", getFeedTestEnv("DB_PORT", "5432"))
	os.Setenv("DB_NAME", getFeedTestEnv("DB_NAME", "notification_test"))

	if err := database.Connect(); err != nil {
		fmt.Printf("SKIP: banco de dados indisponível: %v\n", err)
		os.Exit(0)
	}

	if _, err := database.DB.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS notifications (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			type VARCHAR(50) NOT NULL,
			recipient_id VARCHAR(255) NOT NULL,
			actor_id VARCHAR(255) NOT NULL,
			ref_id VARCHAR(255) NOT NULL,
			content TEXT,
			read BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW()
		);
	`); err != nil {
		fmt.Printf("SKIP: falha ao criar tabelas: %v\n", err)
		os.Exit(0)
	}

	code := m.Run()

	database.DB.Exec(context.Background(), "TRUNCATE notifications")
	database.DB.Close()
	os.Exit(code)
}

func startFeedFakeServers(t *testing.T) {
	t.Helper()

	userServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"accountId":"actor-a","name":"Actor A","username":"actora","avatarUrl":""}`))
	}))
	t.Cleanup(userServer.Close)

	postServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"postId":"post-1","imageUrls":["https://example.com/i.jpg"],"caption":"Legenda","isDeleted":false}`))
	}))
	t.Cleanup(postServer.Close)

	t.Setenv("USER_SERVICE_URL", userServer.URL)
	t.Setenv("POST_SERVICE_URL", postServer.URL)
}

func TestBuildFeed_ReturnsGroupedAndEnrichedNotifications(t *testing.T) {
	startFeedFakeServers(t)
	recipient := fmt.Sprintf("feed-recipient-%d", time.Now().UnixNano())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	if err := repository.CreateNotification("like", recipient, "actor-a", "post-1", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}
	if err := repository.CreateNotification("follow", recipient, "actor-a", "", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}

	feedService := NewNotificationFeedService()
	resp, err := feedService.BuildFeed(recipient, 10, nil)

	if err != nil {
		t.Fatalf("BuildFeed: %v", err)
	}
	if len(resp.Items) != 2 {
		t.Fatalf("expected 2 grouped items (like + follow), got %d", len(resp.Items))
	}

	for _, item := range resp.Items {
		if item.Actor == nil || item.Actor.Name != "Actor A" {
			t.Errorf("expected item to be enriched with actor data, got %+v", item.Actor)
		}
		if item.Type == "like" && (item.Post == nil || item.Post.Caption != "Legenda") {
			t.Errorf("expected like item to be enriched with post data, got %+v", item.Post)
		}
		if item.Type == "follow" && item.Post != nil {
			t.Errorf("expected follow item to have no post enrichment, got %+v", item.Post)
		}
	}
}

func TestBuildFeed_DefaultsLimitWhenZeroOrNegative(t *testing.T) {
	startFeedFakeServers(t)
	recipient := fmt.Sprintf("feed-recipient-limit-%d", time.Now().UnixNano())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	if err := repository.CreateNotification("like", recipient, "actor-a", "post-1", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}

	feedService := NewNotificationFeedService()

	if _, err := feedService.BuildFeed(recipient, 0, nil); err != nil {
		t.Fatalf("BuildFeed with limit=0: %v", err)
	}
	if _, err := feedService.BuildFeed(recipient, -5, nil); err != nil {
		t.Fatalf("BuildFeed with negative limit: %v", err)
	}
}

func TestBuildFeed_EmptyForUnknownRecipient(t *testing.T) {
	startFeedFakeServers(t)

	feedService := NewNotificationFeedService()
	resp, err := feedService.BuildFeed("nobody-has-this-id", 10, nil)

	if err != nil {
		t.Fatalf("BuildFeed: %v", err)
	}
	if len(resp.Items) != 0 {
		t.Errorf("expected empty feed for unknown recipient, got %d items", len(resp.Items))
	}
	if resp.NextCursor != nil {
		t.Errorf("expected nil NextCursor when there is no more data, got %v", resp.NextCursor)
	}
}

func TestCountUnreadGroups(t *testing.T) {
	startFeedFakeServers(t)
	recipient := fmt.Sprintf("feed-unread-%d", time.Now().UnixNano())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	if err := repository.CreateNotification("like", recipient, "actor-a", "post-1", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}
	if err := repository.CreateNotification("follow", recipient, "actor-a", "", ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}

	feedService := NewNotificationFeedService()
	count, err := feedService.CountUnreadGroups(recipient)

	if err != nil {
		t.Fatalf("CountUnreadGroups: %v", err)
	}
	if count != 2 {
		t.Errorf("expected 2 unread groups, got %d", count)
	}

	if _, err := repository.MarkAllReadByRecipient(recipient); err != nil {
		t.Fatalf("MarkAllReadByRecipient: %v", err)
	}

	countAfter, err := feedService.CountUnreadGroups(recipient)
	if err != nil {
		t.Fatalf("CountUnreadGroups after marking read: %v", err)
	}
	if countAfter != 0 {
		t.Errorf("expected 0 unread groups after marking all read, got %d", countAfter)
	}
}

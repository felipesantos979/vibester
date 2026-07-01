//go:build integration

package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"notification-service/internal/database"
	"notification-service/internal/models"
	"notification-service/internal/repository"
	"notification-service/internal/workers"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/gin-gonic/gin"
)

var testRouter *gin.Engine

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)

	_, callerFile, _, _ := runtime.Caller(0)
	templatesDir := filepath.Join(filepath.Dir(callerFile), "..", "templates")
	os.Setenv("TEMPLATES_DIR", templatesDir)

	os.Setenv("DB_USER", getEnv("DB_USER", "postgres"))
	os.Setenv("DB_PASSWORD", getEnv("DB_PASSWORD", "postgres"))
	os.Setenv("DB_HOST", getEnv("DB_HOST", "localhost"))
	os.Setenv("DB_PORT", getEnv("DB_PORT", "5432"))
	os.Setenv("DB_NAME", getEnv("DB_NAME", "notification_test"))

	if err := database.Connect(); err != nil {
		fmt.Printf("SKIP: banco de dados indisponível: %v\n", err)
		os.Exit(0)
	}

	if _, err := database.DB.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS two_factor_codes (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			email VARCHAR(255) NOT NULL,
			code VARCHAR(10) NOT NULL,
			expires_at TIMESTAMP NOT NULL,
			used BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW()
		);
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

	workers.StartEmailWorkers(1)

	testRouter = gin.New()
	testRouter.POST("/notifications/email", SendEmailHandler)
	testRouter.POST("/notifications/reset-password", SendRequestPasswordHandler)
	testRouter.POST("/notifications/welcome", SendWelcomeHandler)
	testRouter.POST("/notifications/2fa", SendTwoFactorHandler)
	testRouter.POST("/notifications/2fa/validate", ValidateTwoFactorHandler)
	testRouter.GET("/notifications/:userId", ListNotificationsHandler)
	testRouter.GET("/notifications/:userId/unread-count", UnreadCountHandler)
	testRouter.PATCH("/notifications/:userId/read", MarkReadHandler)
	testRouter.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	code := m.Run()

	database.DB.Exec(context.Background(), "TRUNCATE two_factor_codes, notifications")
	database.DB.Close()
	os.Exit(code)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func post(path string, body any) *httptest.ResponseRecorder {
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, path, bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)
	return w
}

func get(path string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, path, nil)
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)
	return w
}

func patchRequest(path string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPatch, path, nil)
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)
	return w
}

func TestHealthEndpoint(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestSendEmailHandler_InvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/notifications/email", bytes.NewBufferString("not json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestSendEmailHandler_EnqueuesNotification(t *testing.T) {
	w := post("/notifications/email", models.Notification{
		To:      "test@example.com",
		Subject: "Teste",
		Message: "<p>Olá</p>",
	})

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]string
	json.NewDecoder(w.Body).Decode(&resp)
	if resp["message"] == "" {
		t.Error("expected non-empty message in response")
	}
}

func TestSendWelcomeHandler_RendersTemplate(t *testing.T) {
	w := post("/notifications/welcome", models.Notification{
		To:   "test@example.com",
		Name: "João Silva",
	})

	if w.Code != http.StatusAccepted {
		t.Errorf("expected 202, got %d: %s", w.Code, w.Body.String())
	}
}

func TestSendResetPasswordHandler_RendersTemplate(t *testing.T) {
	w := post("/notifications/reset-password", models.Notification{
		To:        "test@example.com",
		Name:      "João Silva",
		ResetLink: "https://vibester.com.br/reset/abc123",
	})

	if w.Code != http.StatusAccepted {
		t.Errorf("expected 202, got %d: %s", w.Code, w.Body.String())
	}
}

func TestSendTwoFactorHandler_SavesCodeAndEnqueues(t *testing.T) {
	email := fmt.Sprintf("2fa-%d@example.com", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	w := post("/notifications/2fa", models.Notification{
		To:   email,
		Name: "João Silva",
	})

	if w.Code != http.StatusAccepted {
		t.Errorf("expected 202, got %d: %s", w.Code, w.Body.String())
	}

	var count int
	database.DB.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM two_factor_codes WHERE email = $1 AND used = false",
		email,
	).Scan(&count)

	if count != 1 {
		t.Errorf("expected 1 code saved in DB, got %d", count)
	}
}

func TestValidateTwoFactorHandler_ValidCode(t *testing.T) {
	email := fmt.Sprintf("val-%d@example.com", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	post("/notifications/2fa", models.Notification{To: email, Name: "Test"})

	var code string
	database.DB.QueryRow(context.Background(),
		"SELECT code FROM two_factor_codes WHERE email = $1 AND used = false ORDER BY created_at DESC LIMIT 1",
		email,
	).Scan(&code)

	if code == "" {
		t.Fatal("no code found in DB after 2FA send")
	}

	w := post("/notifications/2fa/validate", models.ValidateTwoFactorRequest{
		Email: email,
		Code:  code,
	})

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]bool
	json.NewDecoder(w.Body).Decode(&resp)
	if !resp["valid"] {
		t.Error("expected valid=true")
	}
}

func TestValidateTwoFactorHandler_InvalidCode(t *testing.T) {
	w := post("/notifications/2fa/validate", models.ValidateTwoFactorRequest{
		Email: "nobody@example.com",
		Code:  "000000",
	})

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]bool
	json.NewDecoder(w.Body).Decode(&resp)
	if resp["valid"] {
		t.Error("expected valid=false")
	}
}

func TestValidateTwoFactorHandler_CodeAlreadyUsed(t *testing.T) {
	email := fmt.Sprintf("used-%d@example.com", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM two_factor_codes WHERE email = $1", email)
	})

	post("/notifications/2fa", models.Notification{To: email, Name: "Test"})

	var code string
	database.DB.QueryRow(context.Background(),
		"SELECT code FROM two_factor_codes WHERE email = $1 AND used = false ORDER BY created_at DESC LIMIT 1",
		email,
	).Scan(&code)

	post("/notifications/2fa/validate", models.ValidateTwoFactorRequest{Email: email, Code: code})

	w := post("/notifications/2fa/validate", models.ValidateTwoFactorRequest{Email: email, Code: code})
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for already-used code, got %d", w.Code)
	}
}

func TestValidateTwoFactorHandler_InvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/notifications/2fa/validate", bytes.NewBufferString("bad"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

var idCounter int64

func uniqueID() int64 {
	idCounter++
	return idCounter
}

func TestListNotificationsHandler_EmptyState(t *testing.T) {
	recipient := fmt.Sprintf("recipient-empty-%d", uniqueID())

	w := get("/notifications/" + recipient)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp models.NotificationListResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if len(resp.Items) != 0 {
		t.Errorf("expected no items, got %d", len(resp.Items))
	}
	if resp.NextCursor != nil {
		t.Error("expected nil nextCursor for empty state")
	}
}

func TestListNotificationsHandler_GroupsLikesOnSamePost(t *testing.T) {
	recipient := fmt.Sprintf("recipient-%d", uniqueID())
	postID := fmt.Sprintf("post-%d", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	if err := repository.CreateNotification("like", recipient, "actor-a", postID, ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}
	if err := repository.CreateNotification("like", recipient, "actor-b", postID, ""); err != nil {
		t.Fatalf("CreateNotification: %v", err)
	}

	w := get("/notifications/" + recipient)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp models.NotificationListResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if len(resp.Items) != 1 {
		t.Fatalf("expected 1 grouped item, got %d", len(resp.Items))
	}
	item := resp.Items[0]
	if item.TotalCount != 2 {
		t.Errorf("expected totalCount 2, got %d", item.TotalCount)
	}
	if item.OthersCount != 1 {
		t.Errorf("expected othersCount 1, got %d", item.OthersCount)
	}
	if item.Read {
		t.Error("expected item to be unread")
	}
	// user-service/post-service não estão disponíveis no ambiente de teste:
	// o enriquecimento deve falhar de forma graciosa (actor/post nulos),
	// sem derrubar a resposta.
	if item.Actor != nil {
		t.Error("expected actor to be nil when user-service is unreachable")
	}
	if item.Post != nil {
		t.Error("expected post to be nil when post-service is unreachable")
	}
}

func TestUnreadCountHandler(t *testing.T) {
	recipient := fmt.Sprintf("recipient-%d", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	repository.CreateNotification("follow", recipient, "actor-a", "", "")
	repository.CreateNotification("follow", recipient, "actor-b", "", "")
	repository.CreateNotification("like", recipient, "actor-c", "post-x", "")

	w := get("/notifications/" + recipient + "/unread-count")
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]int
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	// 2 follows não lidos colapsam em 1 grupo + 1 like em outro grupo = 2.
	if resp["count"] != 2 {
		t.Errorf("expected unread count 2, got %d", resp["count"])
	}
}

func TestMarkReadHandler_ClearsUnreadCount(t *testing.T) {
	recipient := fmt.Sprintf("recipient-%d", uniqueID())

	t.Cleanup(func() {
		database.DB.Exec(context.Background(), "DELETE FROM notifications WHERE recipient_id = $1", recipient)
	})

	repository.CreateNotification("follow", recipient, "actor-a", "", "")
	repository.CreateNotification("like", recipient, "actor-b", "post-x", "")

	w := patchRequest("/notifications/" + recipient + "/read")
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var patchResp map[string]int64
	if err := json.NewDecoder(w.Body).Decode(&patchResp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if patchResp["updated"] != 2 {
		t.Errorf("expected 2 rows updated, got %d", patchResp["updated"])
	}

	countW := get("/notifications/" + recipient + "/unread-count")
	var countResp map[string]int
	json.NewDecoder(countW.Body).Decode(&countResp)
	if countResp["count"] != 0 {
		t.Errorf("expected unread count 0 after mark-read, got %d", countResp["count"])
	}
}

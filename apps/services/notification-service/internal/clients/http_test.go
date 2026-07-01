package clients

import (
	"testing"
	"time"
)

func TestNewHTTPClient_DefaultTimeout(t *testing.T) {
	client := newHTTPClient()

	if client.Timeout != 5000*time.Millisecond {
		t.Errorf("expected default timeout of 5000ms, got %v", client.Timeout)
	}
}

func TestNewHTTPClient_CustomTimeout(t *testing.T) {
	t.Setenv("HTTP_CLIENT_TIMEOUT_MS", "1500")

	client := newHTTPClient()

	if client.Timeout != 1500*time.Millisecond {
		t.Errorf("expected timeout of 1500ms, got %v", client.Timeout)
	}
}

func TestNewHTTPClient_InvalidTimeoutFallsBackToDefault(t *testing.T) {
	t.Setenv("HTTP_CLIENT_TIMEOUT_MS", "not-a-number")

	client := newHTTPClient()

	if client.Timeout != 5000*time.Millisecond {
		t.Errorf("expected fallback to 5000ms on invalid value, got %v", client.Timeout)
	}
}

func TestNewHTTPClient_NegativeTimeoutFallsBackToDefault(t *testing.T) {
	t.Setenv("HTTP_CLIENT_TIMEOUT_MS", "-100")

	client := newHTTPClient()

	if client.Timeout != 5000*time.Millisecond {
		t.Errorf("expected fallback to 5000ms on negative value, got %v", client.Timeout)
	}
}

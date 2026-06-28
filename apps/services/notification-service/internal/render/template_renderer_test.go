package render

import (
	"notification-service/internal/models"
	"strings"
	"testing"
)

func TestParseWelcomeTemplate(t *testing.T) {
	result, err := ParseTemplate("../templates/welcome.html", models.WelcomeEmailData{
		Name:         "João Silva",
		PlatformLink: "https://vibester.com.br",
	})
	if err != nil {
		t.Fatalf("ParseTemplate returned error: %v", err)
	}
	if !strings.Contains(result, "João Silva") {
		t.Errorf("expected rendered HTML to contain 'João Silva'")
	}
	if !strings.Contains(result, "vibester.com.br") {
		t.Errorf("expected rendered HTML to contain platform link 'vibester.com.br'")
	}
	if len(result) == 0 {
		t.Error("expected non-empty HTML output")
	}
}

func TestParseTemplateFileNotFound(t *testing.T) {
	_, err := ParseTemplate("../templates/non_existent_template.html", nil)
	if err == nil {
		t.Error("expected error for missing template file, got nil")
	}
}

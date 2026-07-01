package helpers

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestGetTemplatePath_WithEnvOverride(t *testing.T) {
	t.Setenv("TEMPLATES_DIR", "/custom/templates")

	got := GetTemplatePath("welcome.html")
	want := filepath.Join("/custom/templates", "welcome.html")

	if got != want {
		t.Errorf("GetTemplatePath() = %q, want %q", got, want)
	}
}

func TestGetTemplatePath_WithoutEnvOverride(t *testing.T) {
	t.Setenv("TEMPLATES_DIR", "")

	got := GetTemplatePath("welcome.html")

	if !strings.HasSuffix(got, filepath.Join("templates", "welcome.html")) {
		t.Errorf("GetTemplatePath() = %q, expected it to end with templates/welcome.html", got)
	}
}

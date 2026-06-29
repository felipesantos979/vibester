package helpers

import (
	"os"
	"path/filepath"
	"runtime"
)

func GetTemplatePath(file string) string {
	if dir := os.Getenv("TEMPLATES_DIR"); dir != "" {
		return filepath.Join(dir, file)
	}
	_, callerFile, _, _ := runtime.Caller(0)
	base := filepath.Join(filepath.Dir(callerFile), "..", "templates")
	return filepath.Join(base, file)
}

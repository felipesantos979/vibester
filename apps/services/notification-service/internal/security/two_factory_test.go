package security

import (
	"strconv"
	"testing"
)

func TestGenerateTwoFactorCode_Format(t *testing.T) {
	code := GenerateTwoFactorCode()

	if len(code) != 6 {
		t.Errorf("expected code length 6, got %d (code: %s)", len(code), code)
	}

	n, err := strconv.Atoi(code)
	if err != nil {
		t.Fatalf("expected numeric code, got %q: %v", code, err)
	}

	if n < 100_000 || n > 999_999 {
		t.Errorf("expected code in range [100000, 999999], got %d", n)
	}
}

func TestGenerateTwoFactorCode_Uniqueness(t *testing.T) {
	seen := make(map[string]struct{}, 100)

	for i := 0; i < 100; i++ {
		code := GenerateTwoFactorCode()
		seen[code] = struct{}{}
	}

	if len(seen) < 50 {
		t.Errorf("expected high uniqueness across 100 codes, got only %d distinct values", len(seen))
	}
}

func TestGenerateTwoFactorCode_NoLeadingZero(t *testing.T) {
	for i := 0; i < 50; i++ {
		code := GenerateTwoFactorCode()
		if code[0] == '0' {
			t.Errorf("code should not start with 0, got %s", code)
		}
	}
}

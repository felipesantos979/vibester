package config

import "testing"

func TestGetEnv(t *testing.T) {
	t.Setenv("TEST_KEY", "test-value")

	if got := GetEnv("TEST_KEY"); got != "test-value" {
		t.Errorf("GetEnv() = %q, want %q", got, "test-value")
	}
}

func TestGetEnv_Unset(t *testing.T) {
	if got := GetEnv("DEFINITELY_UNSET_KEY_XYZ"); got != "" {
		t.Errorf("GetEnv() = %q, want empty string", got)
	}
}

func TestGetEnvOrDefault_WhenSet(t *testing.T) {
	t.Setenv("TEST_KEY_2", "set-value")

	if got := GetEnvOrDefault("TEST_KEY_2", "fallback"); got != "set-value" {
		t.Errorf("GetEnvOrDefault() = %q, want %q", got, "set-value")
	}
}

func TestGetEnvOrDefault_WhenUnset(t *testing.T) {
	if got := GetEnvOrDefault("DEFINITELY_UNSET_KEY_ABC", "fallback"); got != "fallback" {
		t.Errorf("GetEnvOrDefault() = %q, want %q", got, "fallback")
	}
}

func TestGetEnvOrDefault_WhenEmpty(t *testing.T) {
	t.Setenv("TEST_KEY_EMPTY", "")

	if got := GetEnvOrDefault("TEST_KEY_EMPTY", "fallback"); got != "fallback" {
		t.Errorf("GetEnvOrDefault() = %q, want %q (empty string counts as unset)", got, "fallback")
	}
}

func TestGetKafkaBrokers_Single(t *testing.T) {
	t.Setenv("KAFKA_BROKERS", "localhost:9092")

	got := GetKafkaBrokers()
	want := []string{"localhost:9092"}

	if len(got) != len(want) || got[0] != want[0] {
		t.Errorf("GetKafkaBrokers() = %v, want %v", got, want)
	}
}

func TestGetKafkaBrokers_Multiple(t *testing.T) {
	t.Setenv("KAFKA_BROKERS", "broker1:9092,broker2:9092,broker3:9092")

	got := GetKafkaBrokers()

	if len(got) != 3 {
		t.Fatalf("GetKafkaBrokers() returned %d brokers, want 3", len(got))
	}
	if got[0] != "broker1:9092" || got[1] != "broker2:9092" || got[2] != "broker3:9092" {
		t.Errorf("GetKafkaBrokers() = %v, unexpected values", got)
	}
}

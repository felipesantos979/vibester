BINARY=notification-service

.PHONY: build run test test-integration lint

build:
	go build -o $(BINARY) ./cmd/api

run:
	go run ./cmd/api

test:
	go test ./...

test-integration:
	go test -v -tags=integration -timeout=60s \
		./internal/handlers/... \
		./internal/repository/...

lint:
	go vet ./...

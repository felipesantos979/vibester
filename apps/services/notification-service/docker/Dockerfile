FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

# Resolve as dependências do swaggo (swagger) e atualiza o go.sum.
RUN go mod tidy

RUN go build -o notification-service ./cmd/api

EXPOSE 3005

CMD ["./notification-service"]

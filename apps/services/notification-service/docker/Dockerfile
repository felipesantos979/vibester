FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o notification-service ./cmd/api

EXPOSE 3005

CMD ["./notification-service"]
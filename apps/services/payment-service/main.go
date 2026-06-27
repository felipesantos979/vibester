package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/felipesantos979/vibester/apps/services/payment-service/abacatepay"
	"github.com/felipesantos979/vibester/apps/services/payment-service/db"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const savePaymentTimeout = 5 * time.Second

type CheckoutRequest struct {
	ProductID string   `json:"productId" binding:"required"`
	Quantity  int      `json:"quantity" binding:"required,gt=0"`
	Methods   []string `json:"methods"`
}

type CheckoutResponse struct {
	URL string `json:"url"`
}

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	apiKey := os.Getenv("ABACATEPAY_API_KEY")
	if apiKey == "" {
		log.Fatal("ABACATEPAY_API_KEY environment variable not set")
	}

	database, err := db.NewDB(databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	client := abacatepay.NewClient(apiKey)

	router := gin.Default()

	router.POST("/checkout", func(c *gin.Context) {
		var req CheckoutRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
			return
		}

		checkout, err := client.CreateCheckoutWithMethods(req.ProductID, req.Quantity, req.Methods)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		billID := uuid.New().String()
		saveCtx, cancel := context.WithTimeout(c.Request.Context(), savePaymentTimeout)
		defer cancel()

		if err := <-savePaymentAsync(saveCtx, database, billID, checkout.Data.ID, 0); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save payment"})
			return
		}

		c.JSON(http.StatusOK, CheckoutResponse{URL: checkout.Data.URL})
	})

	log.Println("Starting payment service on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func savePaymentAsync(ctx context.Context, database *db.DB, billID, externalID string, amount int) <-chan error {
	result := make(chan error, 1)

	go func() {
		result <- database.InsertPaymentContext(ctx, billID, externalID, amount)
	}()

	return result
}

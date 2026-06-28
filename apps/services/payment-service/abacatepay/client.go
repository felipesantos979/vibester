package abacatepay

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const BaseURL = "https://api.abacatepay.com/v2"
const defaultHTTPTimeout = 15 * time.Second

type Client struct {
	apiKey     string
	httpClient *http.Client
}

type CheckoutRequest struct {
	Items   []CheckoutItem `json:"items"`
	Methods []string       `json:"methods,omitempty"`
}

type CheckoutItem struct {
	ID       string `json:"id"`
	Quantity int    `json:"quantity"`
}

type CheckoutResponse struct {
	Data struct {
		ID  string `json:"id"`
		URL string `json:"url"`
	} `json:"data"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

func NewClient(apiKey string) *Client {
	return &Client{
		apiKey:     apiKey,
		httpClient: &http.Client{Timeout: defaultHTTPTimeout},
	}
}

func (c *Client) CreateCheckout(productID string, quantity int) (*CheckoutResponse, error) {
	return c.CreateCheckoutWithMethods(productID, quantity, nil)
}

func (c *Client) CreateCheckoutWithMethods(productID string, quantity int, methods []string) (*CheckoutResponse, error) {
	req := CheckoutRequest{
		Items: []CheckoutItem{
			{
				ID:       productID,
				Quantity: quantity,
			},
		},
		Methods: methods,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", BaseURL+"/checkouts/create", bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to call AbacatePay: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("AbacatePay returned status %d: %s", resp.StatusCode, string(respBody))
	}

	var checkoutResp CheckoutResponse
	if err := json.Unmarshal(respBody, &checkoutResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if !checkoutResp.Success {
		return nil, fmt.Errorf("AbacatePay error: %s", checkoutResp.Error)
	}

	return &checkoutResp, nil
}

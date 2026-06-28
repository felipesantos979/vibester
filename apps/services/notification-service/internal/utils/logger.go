package utils

import (
	"os"

	"github.com/charmbracelet/log"
)

var Logger = log.NewWithOptions(os.Stdout, log.Options{
	ReportCaller:    false,
	ReportTimestamp: true,
	TimeFormat:      "15:04:05",
	Prefix:          "notification-service",
})

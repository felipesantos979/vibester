package render

import (
	"bytes"
	"html/template"
)

func ParseTemplate(path string, data any) (string, error) {
	tmpl, err := template.ParseFiles(path)

	if err != nil {
		return "", err
	}

	var body bytes.Buffer

	err = tmpl.Execute(&body, data)

	if err != nil {
		return "", err
	}

	return body.String(), nil
}

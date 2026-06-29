package kafka

import (
	"context"
	"encoding/json"
	"notification-service/internal/helpers"
	"notification-service/internal/models"
	"notification-service/internal/render"
	"notification-service/internal/repository"
	"notification-service/internal/utils"
	"notification-service/internal/workers"

	kafkaGo "github.com/segmentio/kafka-go"
)

type userRegisteredEvent struct {
	AccountId string `json:"accountId"`
	Email     string `json:"email"`
	Username  string `json:"username"`
	Name      string `json:"name"`
}

type postLikedEvent struct {
	PostId        string `json:"postId"`
	PostOwnerId   string `json:"postOwnerId"`
	LikedByUserId string `json:"likedByUserId"`
}

type postCommentedEvent struct {
	PostId              string `json:"postId"`
	PostOwnerId         string `json:"postOwnerId"`
	CommentedByUserId   string `json:"commentedByUserId"`
	Content             string `json:"content"`
}

type userFollowedEvent struct {
	FollowerId  string `json:"followerId"`
	FollowingId string `json:"followingId"`
}

type emailVerificationEvent struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Code  string `json:"code"`
}

func StartConsumers(brokers []string) {
	go consumeUserRegistered(brokers)
	go consumePostEvents(brokers)
	go consumeUserFollowed(brokers)
	go consumeEmailVerification(brokers)
}

func consumeEmailVerification(brokers []string) {
	r := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   "auth.email.verification",
		GroupID: "notification-service-auth-group",
	})
	defer r.Close()

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao ler auth.email.verification: %v", err)
			continue
		}

		var event emailVerificationEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao parsear auth.email.verification: %v", err)
			continue
		}

		htmlBody, err := render.ParseTemplate(
			helpers.GetTemplatePath("two_factor_code.html"),
			models.TwoFactorData{
				Name: event.Name,
				Code: event.Code,
			},
		)
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao renderizar template two_factor_code: %v", err)
			continue
		}

		workers.EmailQueue <- models.Notification{
			To:      event.Email,
			Subject: "Aqui está o seu código de verificação",
			Message: htmlBody,
		}

		utils.Logger.Infof("[KAFKA] Código de verificação enfileirado para %s", event.Email)
	}
}

func consumeUserRegistered(brokers []string) {
	r := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   "user.registered",
		GroupID: "notification-service-user-group",
	})
	defer r.Close()

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao ler user.registered: %v", err)
			continue
		}

		var event userRegisteredEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao parsear user.registered: %v", err)
			continue
		}

		htmlBody, err := render.ParseTemplate(
			helpers.GetTemplatePath("welcome.html"),
			models.WelcomeEmailData{
				Name:         event.Name,
				PlatformLink: "https://vibester.com.br",
			},
		)
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao renderizar template welcome: %v", err)
			continue
		}

		workers.EmailQueue <- models.Notification{
			To:      event.Email,
			Subject: "Seja bem vindo ao Vibester!",
			Message: htmlBody,
		}

		utils.Logger.Infof("[KAFKA] Welcome email enfileirado para %s", event.Email)
	}
}

func consumeUserFollowed(brokers []string) {
	r := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   "user.followed",
		GroupID: "notification-service-follow-group",
	})
	defer r.Close()

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao ler user.followed: %v", err)
			continue
		}

		var event userFollowedEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao parsear user.followed: %v", err)
			continue
		}

		if err := repository.CreateNotification("follow", event.FollowingId, event.FollowerId, "", ""); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao salvar notificação de follow: %v", err)
		}

		utils.Logger.Infof("[KAFKA] Notificação de follow salva: %s -> %s", event.FollowerId, event.FollowingId)
	}
}

func consumePostEvents(brokers []string) {
	r := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   "post.liked",
		GroupID: "notification-service-post-group",
	})
	defer r.Close()

	rCommented := kafkaGo.NewReader(kafkaGo.ReaderConfig{
		Brokers: brokers,
		Topic:   "post.commented",
		GroupID: "notification-service-post-group",
	})
	defer rCommented.Close()

	go func() {
		for {
			msg, err := r.ReadMessage(context.Background())
			if err != nil {
				utils.Logger.Errorf("[KAFKA] Erro ao ler post.liked: %v", err)
				continue
			}

			var event postLikedEvent
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				utils.Logger.Errorf("[KAFKA] Erro ao parsear post.liked: %v", err)
				continue
			}

			if err := repository.CreateNotification("like", event.PostOwnerId, event.LikedByUserId, event.PostId, ""); err != nil {
				utils.Logger.Errorf("[KAFKA] Erro ao salvar notificação de like: %v", err)
			}
		}
	}()

	for {
		msg, err := rCommented.ReadMessage(context.Background())
		if err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao ler post.commented: %v", err)
			continue
		}

		var event postCommentedEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao parsear post.commented: %v", err)
			continue
		}

		if err := repository.CreateNotification("comment", event.PostOwnerId, event.CommentedByUserId, event.PostId, event.Content); err != nil {
			utils.Logger.Errorf("[KAFKA] Erro ao salvar notificação de comentário: %v", err)
		}
	}
}

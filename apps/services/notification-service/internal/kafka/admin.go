package kafka

import (
	"net"
	"strconv"

	kafkaGo "github.com/segmentio/kafka-go"
	"notification-service/internal/utils"
)

func EnsureTopics(brokers []string, topics []string) {
	conn, err := kafkaGo.Dial("tcp", brokers[0])
	if err != nil {
		utils.Logger.Errorf("[KAFKA] Erro ao conectar para garantir tópicos: %v", err)
		return
	}
	defer conn.Close()

	controller, err := conn.Controller()
	if err != nil {
		utils.Logger.Errorf("[KAFKA] Erro ao obter controller Kafka: %v", err)
		return
	}

	controllerConn, err := kafkaGo.Dial("tcp", net.JoinHostPort(controller.Host, strconv.Itoa(controller.Port)))
	if err != nil {
		utils.Logger.Errorf("[KAFKA] Erro ao conectar ao controller Kafka: %v", err)
		return
	}
	defer controllerConn.Close()

	topicConfigs := make([]kafkaGo.TopicConfig, len(topics))
	for i, topic := range topics {
		topicConfigs[i] = kafkaGo.TopicConfig{
			Topic:             topic,
			NumPartitions:     1,
			ReplicationFactor: 1,
		}
	}

	if err := controllerConn.CreateTopics(topicConfigs...); err != nil {
		utils.Logger.Warnf("[KAFKA] Tópicos já existem ou aviso ao criar: %v", err)
	} else {
		utils.Logger.Infof("[KAFKA] Tópicos garantidos: %v", topics)
	}
}

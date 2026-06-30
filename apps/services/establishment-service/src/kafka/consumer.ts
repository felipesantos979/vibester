import { Consumer, EachMessagePayload } from "kafkajs";
import { z } from "zod";
import { kafka } from "./client";
import { EstablishmentService } from "../services/establishment.service";

const movementUpdatedSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal("establishment.movement.updated"),
  occurredAt: z.string(),
  data: z.object({
    establishmentId: z.string().uuid(),
    level: z.enum(["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH", "UNAVAILABLE"]),
    source: z.enum(["SERPAPI", "ESTIMATED"]),
  }),
});

export class EstablishmentKafkaConsumer {
  private consumer: Consumer;

  constructor() {
    this.consumer = kafka.consumer({ groupId: "establishment-service-group" });
  }

  async start() {
    await this.connectWithRetry();

    await this.consumer.subscribe({ topic: "establishments", fromBeginning: false });

    await this.consumer.run({ eachMessage: (payload) => this.handleMessage(payload) });

    console.log("[Kafka] establishment-service consumer started");
  }

  async stop() {
    await this.consumer.disconnect();
  }

  private async handleMessage({ message }: EachMessagePayload) {
    const value = message.value?.toString();
    if (!value) return;

    try {
      const raw = JSON.parse(value);

      const parsed = movementUpdatedSchema.safeParse(raw);
      if (!parsed.success || parsed.data.eventType !== "establishment.movement.updated") return;

      const { establishmentId, level } = parsed.data.data;
      await EstablishmentService.updateMovementLevel(establishmentId, level);

      console.log(`[Kafka] nivelMovimento atualizado: ${establishmentId} → ${level}`);
    } catch (error) {
      console.error("[Kafka] Erro ao processar establishment.movement.updated:", error);
    }
  }

  private async connectWithRetry(maxAttempts = 10) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.consumer.connect();
        console.log("[Kafka] establishment-service consumer conectado");
        return;
      } catch {
        console.error(`[Kafka] Tentativa ${attempt}/${maxAttempts} falhou. Aguardando 5s...`);
        if (attempt === maxAttempts) throw new Error("Falha ao conectar ao Kafka");
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
}

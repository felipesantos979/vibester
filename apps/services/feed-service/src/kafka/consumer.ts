import { Consumer, EachMessagePayload } from "kafkajs";
import { FeedService } from "../services/feed.service";
import { kafkaEventSchema } from "../schema/events/kafka-event.schema";
import { feedItemSchema } from "../schema/events/post-created.schema";
import { followSchema } from "../schema/events/follow.schema";
import { postContentUpdatedSchema } from "../schema/events/post-content-updated.schema";
import { postDeletedDataSchema } from "../schema/events/post-deleted.schema";
import { postStatsUpdatedSchema } from "../schema/events/post-stats-updated.schema";
import { eventUnconfirmanceSchema } from "../schema/events/event-unconfirmance";
import { eventConfirmanceSchema } from "../schema/events/event-confirmance";
import { kafka } from "./client";

export class KafkaConsumer {
    private consumer: Consumer;

    private readonly topics = [
        "posts",
        "users",
        "establishments",
        "events"
    ];

    private handlers = {
        "post.created": async (data: unknown) =>
            this.feedService.handlePostCreated(feedItemSchema.parse(data)),

        "post.deleted": async (data: unknown) =>
            this.feedService.handlePostDeleted(postDeletedDataSchema.parse(data)),

        "post.content.updated": async (data: unknown) =>
            this.feedService.handleContentPostUpdated(postContentUpdatedSchema.parse(data)),

        "post.stats.updated": async (data: unknown) =>
            this.feedService.handlePostStatsUpdated(postStatsUpdatedSchema.parse(data)),

        "user.followed": async (data: unknown) =>
            this.feedService.handleUserFollowed(followSchema.parse(data)),

        "user.unfollowed": async (data: unknown) =>
            this.feedService.handleUserUnfollowed(followSchema.parse(data)),

        "establishment.followed": async (data: unknown) =>
            this.feedService.handleEstablishmentFollowed(followSchema.parse(data)),

        "establishment.unfollowed": async (data: unknown) =>
            this.feedService.handleEstablishmentUnfollowed(followSchema.parse(data)),

        "event.created": async (data: unknown) =>
            this.feedService.handleEventCreated(feedItemSchema.parse(data)),

        "event.confirmed": async (data: unknown) =>
            this.feedService.handleEventConfirmed(eventConfirmanceSchema.parse(data)),

        "event.unconfirmed": async (data: unknown) =>
            this.feedService.handleEventUnconfirmed(eventUnconfirmanceSchema.parse(data)),
    };

    constructor(private readonly feedService: FeedService) {

        this.consumer = kafka.consumer({
            groupId: "feed-service-group",
        });
    }

    async start() {
        await this.connectWithRetry();

        for (const topic of this.topics) {
            await this.consumer.subscribe({
                topic,
                fromBeginning: false,
            });
        }

        await this.consumer.run({
            eachMessage: async (payload) => {
                await this.handleMessage(payload);
            },
        });

        console.log("Kafka consumer started");
    }

    private async handleMessage({ message }: EachMessagePayload) {
        const value = message.value?.toString();

        if (!value) return;

        try {
            const rawEvent = JSON.parse(value);

            const event = kafkaEventSchema.parse(rawEvent);

            const handler = this.handlers[event.eventType as keyof typeof this.handlers];

            if (!handler) {
                console.warn(`Unhandled event type: ${event.eventType}`, event.data);
                return;
            }

            await handler(event.data);
        } catch (error) {
            console.error(error);
        }
    }

    private async connectWithRetry(maxAttempts = 10) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await this.consumer.connect();
                console.log("Kafka connected");
                return;
            } catch (error) {
                console.error(`Kafka unavailable. Attempt ${attempt}/${maxAttempts}. Retrying in 5s...`);

                if (attempt === maxAttempts) {
                    throw new Error(`Failed to connect to Kafka after ${maxAttempts} attempts`);
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
    }
}
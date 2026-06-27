import { z } from "zod";

export const kafkaEventSchema = z.object({
    eventId: z.uuid(),
    eventType: z.string(),
    occurredAt: z.iso.datetime(),
    data: z.unknown()
});
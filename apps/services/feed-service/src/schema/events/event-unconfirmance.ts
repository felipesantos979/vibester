import { z } from "zod";

export const eventUnconfirmanceSchema = z.object({
    eventId: z.string().uuid(),
    userId: z.string().uuid(),
});

export type EventAttendanceEvent =
    z.infer<typeof eventUnconfirmanceSchema>;
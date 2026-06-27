import { z } from "zod";

export const eventConfirmanceSchema = z.object({
    eventId: z.string().uuid(),
    userId: z.string().uuid(),
    eventDate: z.iso.datetime()
});

export type EventAttendanceEvent =
    z.infer<typeof eventConfirmanceSchema>;
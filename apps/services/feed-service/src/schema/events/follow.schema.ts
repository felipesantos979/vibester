import { z } from "zod";

export const followSchema = z.object({
    followerId: z.string().uuid(),
    followedId: z.string().uuid()
});

export type FollowData = z.infer<typeof followSchema>;
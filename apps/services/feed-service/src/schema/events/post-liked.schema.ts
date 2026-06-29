import { z } from "zod";

export const postLikedSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.string(),
});

export type PostLikedEvent = z.infer<typeof postLikedSchema>;
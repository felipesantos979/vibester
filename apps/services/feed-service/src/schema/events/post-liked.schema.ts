import { z } from "zod";

export const postLikedSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.string().optional(),
});

export type PostLikedEvent = z.infer<typeof postLikedSchema>;
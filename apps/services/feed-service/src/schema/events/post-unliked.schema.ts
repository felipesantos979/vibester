import { z } from "zod";

export const postUnlikedSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.string(),
});

export type PostUnlikedEvent = z.infer<typeof postUnlikedSchema>;
import { z } from "zod";

export const postStatsUpdatedSchema = z.object({
    authorId: z.string().uuid(),
    postId: z.string().uuid(),
    createdAt: z.iso.datetime(),
    totalLikes: z.number().int().min(0),
    totalComments: z.number().int().min(0)
});

export type UpdatePostStatsEvent =
    z.infer<typeof postStatsUpdatedSchema>;
import { z } from "zod";

export const postDeletedDataSchema = z.object({
    authorId: z.string().uuid(),
    postId: z.string().uuid(),
    createdAt: z.iso.datetime()
});

export type PostDeletedEvent = z.infer<typeof postDeletedDataSchema>;
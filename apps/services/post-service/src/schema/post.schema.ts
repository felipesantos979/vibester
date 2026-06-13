import { z } from "zod";

export const createPostSchema = z.object({
  userId: z.uuid(),
  establishmentId: z.uuid().optional(),
  imageUrls: z.array(z.url()).min(1, "The post must be at leat 1 picture!").max(20),
  caption: z.string().max(250).optional(),
});

export const updatePostSchema = z.object({ caption: z.string().max(250), });

export const postIdParamsSchema = z.object({ postId: z.uuid(), });

export const userIdParamsSchema = z.object({ userId: z.uuid(), });

export const establishmentIdParamsSchema = z.object({ establishmentId: z.uuid(), });
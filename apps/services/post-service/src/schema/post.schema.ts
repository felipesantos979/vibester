import { z } from "zod";

export const createPostSchema = z.object({
  userId: z.string().uuid(),
  userUsername: z.string().min(1),
  userProfilePicture: z.string().url(),
  userVerified: z.string().transform((v) => v === 'true'),
  establishmentId: z.string().uuid().optional(),
  establishmentName: z.string().optional(),
  establishmentLogo: z.string().url().optional(),
  establishmentCategory: z.string().optional(),
  caption: z.string().min(1).max(2000),
  tags: z.string().optional().transform((v) =>
    v ? v.split(',').map((t) => t.trim()) : undefined
  ),
});

export const updatePostSchema = z.object({ caption: z.string().max(250), });

export const postIdParamsSchema = z.object({ postId: z.uuid(), });

export const userIdParamsSchema = z.object({ userId: z.uuid(), });

export const establishmentIdParamsSchema = z.object({ establishmentId: z.uuid(), });
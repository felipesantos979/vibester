import { z } from "zod";

const newFormat = z.object({
    followerId: z.string().uuid(),
    followedId: z.string().uuid(),
});

const legacyFormat = z.object({
    followerId: z.string().uuid(),
    followingId: z.string().uuid(),
}).transform(({ followerId, followingId }) => ({ followerId, followedId: followingId }));

export const followSchema = z.union([newFormat, legacyFormat]);

export type FollowData = z.infer<typeof newFormat>;

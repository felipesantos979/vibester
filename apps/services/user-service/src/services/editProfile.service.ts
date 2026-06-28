import prismaClient from "../prisma/index.js";
import { UpdateAvatarInput, UpdateBioInput } from "../types/profile.types.js";
import { producer } from "../kafka/producer.js";
import { redis } from "../config/redis.js";

export class EditProfileService {
    async updateBio(input: UpdateBioInput) {
        const profile = await prismaClient.userProfile.update({
            where: { userID: input.accountId },
            data: { bio: input.bio }
        });
        await redis.del(`user:profile:${profile.userID}`).catch(() => {});
        return profile;
    }

    async updateAvatar(input: UpdateAvatarInput) {
        const profile = await prismaClient.userProfile.update({
            where: { userID: input.accountId },
            data: { avatarUrl: input.avatarUrl }
        });
        await redis.del(`user:profile:${profile.userID}`).catch(() => {});
        return profile;
    }

    async increaseFollower(followerId: string, followingId: string) {
        await prismaClient.userFollow.create({ data: { followerId, followingId } });

        await Promise.all([
            prismaClient.userProfile.update({
                where: { userID: followingId },
                data: { followers: { increment: 1 } },
            }),
            prismaClient.userProfile.update({
                where: { userID: followerId },
                data: { following: { increment: 1 } },
            }),
        ]);

        await producer.send({
            topic: 'user.followed',
            messages: [{ value: JSON.stringify({ followerId, followingId }) }],
        });

        const result = await prismaClient.userProfile.findUniqueOrThrow({ where: { userID: followingId } });

        await redis.del(
            `user:followers:${followingId}`,
            `user:following:${followerId}`,
            `user:profile:${result.userID}`,
        ).catch(() => {});

        return result;
    }

    async decreaseFollower(followerId: string, followingId: string) {
        await prismaClient.userFollow.delete({
            where: { followerId_followingId: { followerId, followingId } },
        });

        await Promise.all([
            prismaClient.userProfile.update({
                where: { userID: followingId },
                data: { followers: { decrement: 1 } },
            }),
            prismaClient.userProfile.update({
                where: { userID: followerId },
                data: { following: { decrement: 1 } },
            }),
        ]);

        const result = await prismaClient.userProfile.findUniqueOrThrow({ where: { userID: followingId } });

        await redis.del(
            `user:followers:${followingId}`,
            `user:following:${followerId}`,
            `user:profile:${result.userID}`,
        ).catch(() => {});

        return result;
    }
}

import prismaClient from "../prisma/index.js";
import { UpdateAvatarInput, UpdateBioInput } from "../types/profile.types.js";
import { producer } from "../kafka/producer.js";

export class EditProfileService {
    async updateBio(input: UpdateBioInput) {
        return prismaClient.userProfile.update({
            where: { userID: input.userID },
            data: { bio: input.bio }
        });
    }

    async updateAvatar(input: UpdateAvatarInput) {
        return prismaClient.userProfile.update({
            where: { userID: input.userID },
            data: { avatarUrl: input.avatarUrl }
        });
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

        return prismaClient.userProfile.findUniqueOrThrow({ where: { userID: followingId } });
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

        return prismaClient.userProfile.findUniqueOrThrow({ where: { userID: followingId } });
    }
}

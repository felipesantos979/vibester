import prismaClient from "../prisma/index.js";

export class GetFollowersService {
    async listFollowers(userID: string) {
        return prismaClient.userFollow.findMany({
            where: { followingId: userID },
            select: { followerId: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async listFollowing(userID: string) {
        return prismaClient.userFollow.findMany({
            where: { followerId: userID },
            select: { followingId: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}

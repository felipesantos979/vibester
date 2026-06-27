import prismaClient from "../prisma/index.js";
import { cacheAside } from "../config/redis.js";

export class GetFollowersService {
    async listFollowers(userID: string) {
        return cacheAside(`user:followers:${userID}`, 60, () =>
            prismaClient.userFollow.findMany({
                where: { followingId: userID },
                select: { followerId: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            })
        );
    }

    async listFollowing(userID: string) {
        return cacheAside(`user:following:${userID}`, 60, () =>
            prismaClient.userFollow.findMany({
                where: { followerId: userID },
                select: { followingId: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            })
        );
    }
}

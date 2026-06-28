import prismaClient from "../prisma/index.js";
import { cacheAside } from "../config/redis.js";

export class GetFollowersService {
    async listFollowers(accountId: string) {
        return cacheAside(`user:followers:${accountId}`, 60, () =>
            prismaClient.userFollow.findMany({
                where: { followingId: accountId },
                select: { followerId: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            })
        );
    }

    async listFollowing(accountId: string) {
        return cacheAside(`user:following:${accountId}`, 60, () =>
            prismaClient.userFollow.findMany({
                where: { followerId: accountId },
                select: { followingId: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            })
        );
    }
}

import prismaClient from "../prisma/index.js";

export class CheckFollowService {
    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await prismaClient.userFollow.count({
            where: { followerId, followingId },
        });

        return follow > 0;
    }
}
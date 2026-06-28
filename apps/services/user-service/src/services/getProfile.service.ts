import prismaClient from "../prisma/index.js";
import { cacheAside } from "../config/redis.js";

export class GetProfileService {
    async getProfileByAccountId(accountId: string) {
        return cacheAside(`user:profile:${accountId}`, 60, () =>
            prismaClient.userProfile.findUnique({ where: { userID: accountId } })
        );
    }
}

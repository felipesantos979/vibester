import prismaClient from "../prisma/index.js";
import { cacheAside } from "../config/redis.js";

export class GetProfileService {
    async getProfileById(id: string) {
        return cacheAside(`user:profile:${id}`, 60, () =>
            prismaClient.userProfile.findUnique({ where: { id } })
        );
    }
}

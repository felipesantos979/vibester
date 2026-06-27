import prismaClient from "../prisma/index.js";

export class GetProfileService {
    async getProfileById(id: string) {
        return prismaClient.userProfile.findUnique({ where: { id } });
    }
}

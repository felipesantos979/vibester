import prismaClient from "../prisma/index.js";
import { CreateProfileInput } from "../types/profile.types.js";

export class CreateProfileService {
    async createProfile(input: CreateProfileInput) {
        const profile = await prismaClient.userProfile.create({
            data: {
                userID: input.accountId,
                name: input.name,
                username: input.username,
            }
        });

        return profile;
    }
}

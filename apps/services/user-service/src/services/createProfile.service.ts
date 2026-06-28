import prismaClient from "../prisma/index.js";
import { CreateProfileInput } from "../types/profile.types.js";

export class CreateProfileService {
    async createProfile(input: CreateProfileInput) {
        console.log("Criando perfil de usuário", input.accountId);

        const profile = await prismaClient.userProfile.create({
            data: {
                userID: input.accountId
            }
        });

        return profile;
    }
}
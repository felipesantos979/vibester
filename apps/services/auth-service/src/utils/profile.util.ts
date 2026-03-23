import { env } from "../config/env";

export interface Profile {
    id: string
    userId: string
    username: string
    name: string
    avatarUrl: string | null
    bio: string | null
}

export const profileUtil = {
    async getByUserId(userId: string): Promise<Profile | null> {
        try {
            const response = await fetch(
                `${env.profileServiceUrl}/profiles/${userId}`,
            )

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.data
        } catch {
            return null;
        }
    },
}

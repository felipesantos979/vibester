import prismaClient from "../prisma";

export class CheckUserCheckInService {
    async check(eventId: string, userId: string) {
        const existing = await prismaClient.eventCheckIn.findUnique({
            where: { eventId_userId: { eventId, userId } },
            select: { id: true },
        });

        return { checkedIn: !!existing };
    }
}
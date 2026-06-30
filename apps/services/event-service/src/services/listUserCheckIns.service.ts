import prismaClient from "../prisma";

export class ListUserCheckInsService {
    async list(userId: string) {
        const checkIns = await prismaClient.eventCheckIn.findMany({
            where: { userId },
            include: { event: true },
            orderBy: { event: { startDate: "asc" } },
        });

        return checkIns.map((checkIn) => ({
            ...checkIn.event,
            checkedInAt: checkIn.createdAt,
        }));
    }
}
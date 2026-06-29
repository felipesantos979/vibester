import prismaClient from "../prisma";
import { cacheAside } from "../config/redis";
import { Prisma } from "../generated/prisma/client";

type EventResult = Prisma.EventGetPayload<Record<string, never>>;

export class GetEventsByWeekService {
    async get(date: string) {
        const startOfWeek = new Date(date);
        startOfWeek.setUTCHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        const cacheKey = `event:week:${startOfWeek.toISOString().slice(0, 10)}`;

        return cacheAside<EventResult[]>(cacheKey, 120, () =>
            prismaClient.event.findMany({
                where: {
                    startDate: {
                        gte: startOfWeek,
                        lte: endOfWeek,
                    },
                },
                orderBy: { startDate: "asc" },
            })
        );
    }
}
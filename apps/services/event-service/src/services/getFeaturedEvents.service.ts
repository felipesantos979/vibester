import prismaClient from "../prisma";
import { cacheAside } from "../config/redis";
import { Prisma } from "../generated/prisma/client";

type EventResult = Prisma.EventGetPayload<Record<string, never>>;

export class GetFeaturedEventsService {
    async get() {
        return cacheAside<EventResult[]>("event:featured", 60, () =>
            prismaClient.event.findMany({
                where: { isFeatured: true },
                orderBy: { startDate: "asc" },
            })
        );
    }
}
import prismaClient from "../prisma";
import { cacheAside } from "../config/redis";
import { Prisma } from "../generated/prisma/client"; 

type EventResult = Prisma.EventGetPayload<Record<string, never>>;

export class GetEventsByEstablishmentService {
    async get(establishmentId: string) {
        return cacheAside<EventResult[]>(`event:establishment:${establishmentId}`, 120, () =>
            prismaClient.event.findMany({
                where: { establishmentId },
                orderBy: { startDate: "asc" },
            })
        );
    }
}

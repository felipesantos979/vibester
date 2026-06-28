import prismaClient from "../prisma";
import { cacheAside } from "../config/redis";

export class GetEventsByEstablishmentService {
    async get(establishmentId: string) {
        return cacheAside(`event:establishment:${establishmentId}`, 120, () =>
            prismaClient.event.findMany({
                where: { establishmentId },
                select: {
                    name: true,
                    organizer: true,
                    location: true,
                    totalConfirmed: true,
                    ticketLink: true,
                },
            })
        );
    }
}

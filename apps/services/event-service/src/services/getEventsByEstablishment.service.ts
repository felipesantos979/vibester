import prismaClient from "../prisma";

export class GetEventsByEstablishmentService {
    async get(establishmentId: string) {
        const events = await prismaClient.event.findMany({
            where: { establishmentId },
            select: {
                name: true,
                organizer: true,
                location: true,
                totalConfirmed: true,
                ticketLink: true,
            },
        });

        return events;
    }
}

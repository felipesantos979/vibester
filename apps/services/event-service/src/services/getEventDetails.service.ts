import prismaClient from "../prisma";

export class GetEventDetailsService{
    async get(eventId: string){
        const event = await prismaClient.event.findUnique({
            where: {
                id: eventId
            }
        });

        if (!event) {
            throw new Error("Evento não encontrado");
        }

        return {
            name: event.name,
            organizer: event.organizer,
            location: event.location,
            totalConfirmed: event.totalConfirmed,
            ticketLink: event.ticketLink
        }
    }
}
import prismaClient from "../prisma";
import { cacheAside } from "../config/redis";

export class GetEventDetailsService{
    async get(eventId: string){
        return cacheAside(`event:id:${eventId}`, 300, async () => {
            const event = await prismaClient.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                throw new Error("Evento não encontrado");
            }

            return event;
        });
    }
}

import prismaClient from "../prisma";

export class ToggleFeaturedService {
    async toggleFeatured(eventId: string, isFeatured: boolean) {
        const event = await prismaClient.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new Error("Evento não encontrado");
        }

        return await prismaClient.event.update({
            where: { id: eventId },
            data: { isFeatured }
        });
    }
}
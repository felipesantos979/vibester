import prismaClient from "../prisma";
import { Prisma } from "../generated/prisma/client";

export class ToggleFeaturedService {
    async toggleFeatured(eventId: string, isFeatured: boolean) {
        try {
            return await prismaClient.event.update({
                where: { id: eventId },
                data: { isFeatured },
                select: { id: true, isFeatured: true },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new Error("Evento não encontrado");
            }
            throw error;
        }
    }
}

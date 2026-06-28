import prismaClient from "../prisma";
import { CreateEventInput } from "../types/event.types.js";
import { redis } from "../config/redis";

export class CreateEventService {
    async createEvent(input: CreateEventInput){

        const event = await prismaClient.event.create({
            data: {
                ...input,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
            }
        });

        await redis.del(`event:establishment:${input.establishmentId}`).catch(() => {});

        return event;
    }
}

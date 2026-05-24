import prismaClient from "../prisma";
import { CreateEventInput } from "../types/event.types.js";

export class CreateEventService {
    async createEvent(input: CreateEventInput){

        const event = await prismaClient.event.create({
            data: {
                ...input,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
            }
        });

        return event;
    }
}
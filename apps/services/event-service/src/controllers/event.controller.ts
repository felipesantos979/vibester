import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateEventInput } from "../types/event.types.js";
import { CreateEventService } from "../services/createEvent.service.js";
import { ListEventsService } from "../services/listEvents.service.js";
import { GetEventDetailsService } from "../services/getEventDetails.service.js";


const eventService = new CreateEventService();
const listEventsService = new ListEventsService();
const detailsService = new GetEventDetailsService();

export async function eventRoutes(app: FastifyInstance) {
    app.post("/", async (request: FastifyRequest<{ Body: CreateEventInput }>, reply: FastifyReply) => {
        try {
            const event = await eventService.createEvent(request.body);
            return reply.status(201).send(event);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error creating event" });
        }
    });

    app.get("/nearby", async (request: FastifyRequest<{
        Querystring: {
            latitude: string;
            longitude: string;
            radiusKm?: string;
        };
    }>, reply: FastifyReply) => {
        try {
            const latitude = Number(request.query.latitude);
            const longitude = Number(request.query.longitude);
            const radiusKm = request.query.radiusKm ? Number(request.query.radiusKm) : 10;

            const events = await listEventsService.listEvents({
                latitude,
                longitude,
                radiusKm
            });

            return reply.status(200).send(events);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing nearby events" });
        }
    });

    app.get("/:eventId", async (request: FastifyRequest<{
        Params: {
            eventId: string;
        };
    }>, reply: FastifyReply) => {
        try {
            const eventDetaisl = await detailsService.get(request.params.eventId);
            return reply.status(200).send(eventDetaisl);
        } catch (error) {
            return reply.status(500).send({ message: "Error event details" });
        }
    });
}
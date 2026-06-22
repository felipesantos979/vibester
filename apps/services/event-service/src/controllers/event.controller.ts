import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { CreateEventService } from "../services/createEvent.service.js";
import { ListEventsService } from "../services/listEvents.service.js";
import { GetEventDetailsService } from "../services/getEventDetails.service.js";

const eventService = new CreateEventService();
const listEventsService = new ListEventsService();
const detailsService = new GetEventDetailsService();

const createEventSchema = z.object({
    name: z.string(),
    photoUrl: z.string().url(),
    category: z.string(),
    organizer: z.string(),
    location: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    ticketLink: z.string().url().optional(),
    latitude: z.number(),
    longitude: z.number(),
});

const nearbyQuerySchema = z.object({
    latitude: z.string(),
    longitude: z.string(),
    radiusKm: z.string().optional(),
});

const eventIdParamsSchema = z.object({
    eventId: z.string().uuid(),
});

export async function eventRoutes(app: FastifyInstance) {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.post("/", {
        schema: {
            tags: ["Events"],
            summary: "Criar evento",
            body: createEventSchema,
        },
    }, async (request, reply) => {
        try {
            const event = await eventService.createEvent(request.body);
            return reply.status(201).send(event);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error creating event" });
        }
    });

    router.get("/nearby", {
        schema: {
            tags: ["Events"],
            summary: "Listar eventos próximos",
            description: "Lista eventos dentro de um raio (km) a partir de uma coordenada.",
            querystring: nearbyQuerySchema,
        },
    }, async (request, reply) => {
        try {
            const latitude = Number(request.query.latitude);
            const longitude = Number(request.query.longitude);
            const radiusKm = request.query.radiusKm ? Number(request.query.radiusKm) : 10;

            const events = await listEventsService.listEvents({ latitude, longitude, radiusKm });
            return reply.status(200).send(events);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing nearby events" });
        }
    });

    router.get("/:eventId", {
        schema: {
            tags: ["Events"],
            summary: "Detalhes do evento",
            params: eventIdParamsSchema,
        },
    }, async (request, reply) => {
        try {
            const eventDetails = await detailsService.get(request.params.eventId);
            return reply.status(200).send(eventDetails);
        } catch (error) {
            return reply.status(500).send({ message: "Error event details" });
        }
    });
}

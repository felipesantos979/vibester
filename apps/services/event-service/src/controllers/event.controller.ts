import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { CreateEventService } from "../services/createEvent.service.js";
import { ListEventsService } from "../services/listEvents.service.js";
import { GetEventDetailsService } from "../services/getEventDetails.service.js";
import { ToggleFeaturedService } from "../services/toggleFeatured.service.js";
import { GetEventsByEstablishmentService } from "../services/getEventsByEstablishment.service.js";

const toggleFeaturedService = new ToggleFeaturedService();
const eventService = new CreateEventService();
const listEventsService = new ListEventsService();
const detailsService = new GetEventDetailsService();
const byEstablishmentService = new GetEventsByEstablishmentService();

const createEventSchema = z.object({
    name: z.string(),
    photoUrl: z.string().url(),
    category: z.string(),
    organizer: z.string(),
    location: z.string(),
    informacoes: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    ticketLink: z.string().url().optional(),
    latitude: z.number(),
    longitude: z.number(),
    establishmentId: z.string().uuid(),
});

const nearbyQuerySchema = z.object({
    latitude: z.string(),
    longitude: z.string(),
    radiusKm: z.string().optional(),
});

const eventIdParamsSchema = z.object({
    eventId: z.string().uuid(),
});

const establishmentIdParamsSchema = z.object({
    establishmentId: z.string().uuid(),
});

const errorSchema = z.object({ message: z.string() });

const eventDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    photoUrl: z.string(),
    category: z.string(),
    organizer: z.string(),
    location: z.string(),
    informacoes: z.string().nullish(),
    startDate: z.date(),
    endDate: z.date(),
    ticketLink: z.string().nullable(),
    totalConfirmed: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    isFeatured: z.boolean(),
    establishmentId: z.string(),
});

const nearbyEventSchema = z.object({
    id: z.string(),
    name: z.string(),
    informacoes: z.string().nullish(),
    photoUrl: z.string(),
    category: z.string(),
    organizer: z.string(),
    location: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    ticketLink: z.string().nullable(),
    totalConfirmed: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    establishmentId: z.string(),
    isFeatured: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    distanceKm: z.number(),
});

const toggleFeaturedBodySchema = z.object({
    isFeatured: z.boolean(),
});

export async function eventRoutes(app: FastifyInstance) {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.post("/", {
        schema: {
            tags: ["Events"],
            summary: "Criar evento",
            body: createEventSchema,
            response: {
                201: eventDetailsSchema,
                500: errorSchema,
            },
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
            response: {
                200: z.array(nearbyEventSchema),
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const latitude = Number(request.query.latitude);
            const longitude = Number(request.query.longitude);
            const radiusKm = request.query.radiusKm ? Number(request.query.radiusKm) : 10;

            const events = await listEventsService.listEvents({ latitude, longitude, radiusKm });
            return reply.status(200).send(events);
        } catch (error) {
            console.log(error);
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing nearby events" });
        }
    });

    router.get("/establishment/:establishmentId", {
        schema: {
            tags: ["Events"],
            summary: "Eventos de um estabelecimento",
            description: "Retorna todos os eventos vinculados a um estabelecimento.",
            params: establishmentIdParamsSchema,
            response: {
                200: z.array(eventDetailsSchema),
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const events = await byEstablishmentService.get(request.params.establishmentId);
            return reply.status(200).send(events);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing events by establishment" });
        }
    });

    router.get("/:eventId", {
        schema: {
            tags: ["Events"],
            summary: "Detalhes do evento",
            params: eventIdParamsSchema,
            response: {
                200: eventDetailsSchema,
                404: errorSchema,
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const eventDetails = await detailsService.get(request.params.eventId);
            return reply.status(200).send(eventDetails);
        } catch (error) {
            if (error instanceof Error && error.message === "Evento não encontrado") {
                return reply.status(404).send({ message: error.message });
            }
            console.log(error);
            return reply.status(500).send({ message: "Error event details" });
        }
    });

    router.patch("/:eventId/featured", {
        schema: {
            tags: ["Events"],
            summary: "Destacar/remover destaque de evento",
            params: eventIdParamsSchema,
            body: toggleFeaturedBodySchema,
            response: {
                200: z.object({ id: z.string().uuid(), isFeatured: z.boolean() }),
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const event = await toggleFeaturedService.toggleFeatured(
                request.params.eventId,
                request.body.isFeatured
            );
            return reply.status(200).send(event);
        } catch (error) {
            console.log("Erro no toggleFeatured:", error);
            return reply.status(500).send({ message: "Error updating featured status" });
        }
    });
}

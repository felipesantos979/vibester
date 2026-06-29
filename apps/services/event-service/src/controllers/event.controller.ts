import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { CreateEventService } from "../services/createEvent.service.js";
import { ListEventsService } from "../services/listEvents.service.js";
import { GetEventDetailsService } from "../services/getEventDetails.service.js";
import { ToggleFeaturedService } from "../services/toggleFeatured.service.js";
import { GetEventsByEstablishmentService } from "../services/getEventsByEstablishment.service.js";
import { cacheAside, nearbyKey } from "../config/redis.js";
import { GetFeaturedEventsService } from "../services/getFeaturedEvents.service.js";
import { GetEventsByWeekService } from "../services/getEventsByWeek.service.js";

const toggleFeaturedService = new ToggleFeaturedService();
const eventService = new CreateEventService();
const listEventsService = new ListEventsService();
const detailsService = new GetEventDetailsService();
const byEstablishmentService = new GetEventsByEstablishmentService();
const featuredEventsService = new GetFeaturedEventsService();
const eventsByWeekService = new GetEventsByWeekService();

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch {
        return reply.status(401).send({ message: "Token de autenticação inválido ou ausente" });
    }
}

const createEventSchema = z.object({
    name: z.string().min(1).max(200),
    photoUrl: z.string().url(),
    category: z.string().min(1).max(100),
    organizer: z.string().min(1).max(200),
    location: z.string().min(1).max(500),
    informacoes: z.string().max(2000).optional(),
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

const weekQuerySchema = z.object({
    date: z.string().date(), // formato YYYY-MM-DD
});

export async function eventRoutes(app: FastifyInstance) {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.post("/", {
        schema: {
            tags: ["Events"],
            summary: "Criar evento",
            security: [{ bearerAuth: [] }],
            body: createEventSchema,
            response: {
                201: eventDetailsSchema,
                401: errorSchema,
                500: errorSchema,
            },
        },
        preHandler: [authenticate],
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
                400: errorSchema,
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        const latitude = Number(request.query.latitude);
        const longitude = Number(request.query.longitude);
        const radiusKm = request.query.radiusKm ? Number(request.query.radiusKm) : 10;

        if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
            return reply.status(400).send({
                message: "latitude, longitude e radiusKm devem ser números válidos",
            });
        }

        try {
            const key = nearbyKey(latitude, longitude, radiusKm);
            const events = await cacheAside(key, 90, () =>
                listEventsService.listEvents({ latitude, longitude, radiusKm }),
            );
            return reply.status(200).send(events);
        } catch (error) {
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
            request.log.error(error);
            return reply.status(500).send({ message: "Error event details" });
        }
    });

    router.patch("/:eventId/featured", {
        schema: {
            tags: ["Events"],
            summary: "Destacar/remover destaque de evento",
            security: [{ bearerAuth: [] }],
            params: eventIdParamsSchema,
            body: toggleFeaturedBodySchema,
            response: {
                200: z.object({ id: z.string().uuid(), isFeatured: z.boolean() }),
                401: errorSchema,
                404: errorSchema,
                500: errorSchema,
            },
        },
        preHandler: [authenticate],
    }, async (request, reply) => {
        try {
            const event = await toggleFeaturedService.toggleFeatured(
                request.params.eventId,
                request.body.isFeatured,
            );
            return reply.status(200).send(event);
        } catch (error) {
            if (error instanceof Error && error.message === "Evento não encontrado") {
                return reply.status(404).send({ message: error.message });
            }
            request.log.error(error);
            return reply.status(500).send({ message: "Error updating featured status" });
        }
    });

    router.get("/featured", {
        schema: {
            tags: ["Events"],
            summary: "Eventos em destaque",
            description: "Retorna todos os eventos marcados como destaque.",
            response: {
                200: z.array(eventDetailsSchema),
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const events = await featuredEventsService.get();
            return reply.status(200).send(events);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing featured events" });
        }
    });

    router.get("/week", {
        schema: {
            tags: ["Events"],
            summary: "Eventos da semana",
            description: "Retorna todos os eventos que irão acontecer nos 7 dias a partir da data informada.",
            querystring: weekQuerySchema,
            response: {
                200: z.array(eventDetailsSchema),
                400: errorSchema,
                500: errorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const events = await eventsByWeekService.get(request.query.date);
            return reply.status(200).send(events);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ message: "Error listing events by week" });
        }
    });
}

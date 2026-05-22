import { FastifyRequest, FastifyReply } from "fastify";
import { EstablishmentService } from "../services/establishment.service";
import { ListEstablishmentsQuerystring, GetEstablishmentParams } from "../types/establishment.types";
import { z } from "zod";

const getEstablishmentParamsSchema = z.object({
  id: z.string().cuid()
});

export async function listEstablishmentsController(
  request: FastifyRequest<{ Querystring: ListEstablishmentsQuerystring }>,
  reply: FastifyReply
) {
  try {
    const { latitude, longitude } = request.query;
    
    let lat: number | undefined;
    let lon: number | undefined;

    if (latitude !== undefined && longitude !== undefined) {
      lat = parseFloat(latitude as unknown as string);
      lon = parseFloat(longitude as unknown as string);
      
      if (isNaN(lat) || isNaN(lon)) {
        return reply.status(400).send({ message: "Invalid latitude or longitude format" });
      }
    }

    const establishments = await EstablishmentService.listEstablishments(lat, lon);

    return reply.status(200).send(establishments);
  } catch (error) {
    console.error("List establishments error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateEstablishmentRatingController(
  request: FastifyRequest<{ Params: { id: string }, Body: { rating: number } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { rating } = request.body;

    if (rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 5) {
      return reply.status(400).send({ message: "Invalid rating value. Must be a number between 0 and 5." });
    }

    const updatedEstablishment = await EstablishmentService.updateRating(id, rating);
    return reply.status(200).send(updatedEstablishment);
  } catch (error) {
    console.error("Update rating error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function getEstablishmentProfileController(
  request: FastifyRequest<{ Params: GetEstablishmentParams }>,
  reply: FastifyReply
) {
  try {
    const parseResult = getEstablishmentParamsSchema.safeParse(request.params);
    
    if (!parseResult.success) {
      return reply.status(400).send({ message: "Invalid establishment ID" });
    }

    const profile = await EstablishmentService.getEstablishmentProfile(parseResult.data.id);
    return reply.status(200).send(profile);
  } catch (error: any) {
    if (error.message === "Establishment not found") {
      return reply.status(404).send({ message: "Establishment not found" });
    }
    return reply.status(500).send({ message: "Internal server error" });
  }
}

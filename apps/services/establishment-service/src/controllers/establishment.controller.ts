import { FastifyRequest, FastifyReply } from "fastify";
import { EstablishmentService } from "../services/establishment.service";
import {
  ListEstablishmentsQuerystring,
  GetEstablishmentParams,
} from "../types/establishment.types";
import { z } from "zod";
import { UploadService } from "../services/upload.service";

const getEstablishmentParamsSchema = z.object({
  id: z.string().uuid()
});

const generateUploadUrlSchema = z.object({
  establishmentId: z.string().uuid(),
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function listEstablishmentsController(
  request: FastifyRequest<{ Querystring: ListEstablishmentsQuerystring }>,
  reply: FastifyReply
) {
  try {
    const {
      latitude,
      longitude,
      category,
      minRating,
      search,
      sortBy,
    } = request.query;

    let lat: number | undefined;
    let lon: number | undefined;
    let rating: number | undefined;

    const hasOnlyOneCoordinate =
      (latitude !== undefined && longitude === undefined) ||
      (latitude === undefined && longitude !== undefined);

    if (hasOnlyOneCoordinate) {
      return reply.status(400).send({
        message: "Latitude and longitude must be provided together",
      });
    }

    if (latitude !== undefined && longitude !== undefined) {
      lat = parseFloat(latitude);
      lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        return reply.status(400).send({
          message: "Invalid latitude or longitude format",
        });
      }
    }

    if (minRating !== undefined) {
      rating = parseFloat(minRating);

      if (isNaN(rating) || rating < 0 || rating > 5) {
        return reply.status(400).send({
          message: "Invalid minRating. Must be a number between 0 and 5.",
        });
      }
    }

    const establishments = await EstablishmentService.listEstablishments({
      userLat: lat,
      userLon: lon,
      category,
      minRating: rating,
      search,
      sortBy,
    });

    return reply.status(200).send(establishments);
  } catch (error: any) {
    if (error.message === "Latitude and longitude are required to sort by distance") {
      return reply.status(400).send({ message: error.message });
    }

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

    const updatedEstablishment = await EstablishmentService.updateRating(id, rating);

    return reply.status(200).send(updatedEstablishment);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ESTABLISHMENT_NOT_FOUND") {
        return reply.status(404).send({
          message: "Estabelecimento não encontrado",
        });
      }

      if (error.message === "INVALID_RATING") {
        return reply.status(400).send({
          message: "Avaliação deve estar entre 0 e 5",
        });
      }
    }

    return reply.status(500).send({
      message: "Erro interno no servidor",
    });
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

export async function listOpenEstablishmentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const establishments = await EstablishmentService.listOpenEstablishments();
    return reply.status(200).send(establishments);
  } catch (error) {
    console.error("List open establishments error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function uploadProfilePictureController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    const file = await request.file();

    if (!file) {
      return reply.status(400).send({ message: "Nenhum arquivo enviado" });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return reply.status(400).send({ message: "Formato inválido. Use JPEG, PNG ou WebP" });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return reply.status(400).send({ message: "Arquivo muito grande. Máximo 5MB" });
    }

    const publicUrl = await UploadService.uploadProfilePicture(id, fileBuffer, file.mimetype);

    return reply.status(200).send({ photoUrl: publicUrl });
  } catch (error: any) {
    if (error.code === "P2025") {
      return reply.status(404).send({ message: "Estabelecimento não encontrado" });
    }
    console.error("Upload profile picture error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

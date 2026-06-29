import { FastifyRequest, FastifyReply } from "fastify";
import { EstablishmentService } from "../services/establishment.service";
import {
  ListEstablishmentsQuerystring,
  GetEstablishmentParams,
} from "../types/establishment.types";
import { z } from "zod";
import { UploadService } from "../services/upload.service";

const getEstablishmentParamsSchema = z.object({
  id: z.string().uuid(),
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function listEstablishmentsController(
  request: FastifyRequest<{ Querystring: ListEstablishmentsQuerystring }>,
  reply: FastifyReply
) {
  try {
    const { latitude, longitude, category, minRating, search, sortBy, page, limit } =
      request.query;

    let lat: number | undefined;
    let lon: number | undefined;
    let rating: number | undefined;
    let pageNum: number | undefined;
    let limitNum: number | undefined;

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

    if (page !== undefined) {
      pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return reply.status(400).send({ message: "page must be a positive integer" });
      }
    }

    if (limit !== undefined) {
      limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return reply.status(400).send({ message: "limit must be between 1 and 100" });
      }
    }

    const result = await EstablishmentService.listEstablishments({
      userLat: lat,
      userLon: lon,
      category,
      minRating: rating,
      search,
      sortBy,
      page: pageNum,
      limit: limitNum,
    });

    return reply.status(200).send(result);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Latitude and longitude are required to sort by distance"
    ) {
      return reply.status(400).send({ message: error.message });
    }

    console.error("List establishments error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateEstablishmentRatingController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const { rating } = request.body as { rating: number };

    const updatedEstablishment = await EstablishmentService.updateRating(id, rating);

    return reply.status(200).send(updatedEstablishment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "ESTABLISHMENT_NOT_FOUND") {
        return reply.status(404).send({ message: "Estabelecimento não encontrado" });
      }

      if (error.message === "INVALID_RATING") {
        return reply.status(400).send({ message: "Avaliação deve estar entre 0 e 5" });
      }
    }

    console.error("Update establishment rating error:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
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

    const profile = await EstablishmentService.getEstablishmentProfile(
      parseResult.data.id
    );
    return reply.status(200).send(profile);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Establishment not found") {
      return reply.status(404).send({ message: "Establishment not found" });
    }

    console.error("Get establishment profile error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function listOpenEstablishmentsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const establishments = await EstablishmentService.listOpenEstablishments();
    return reply.status(200).send(establishments);
  } catch (error: unknown) {
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
      file.file.resume();
      return reply
        .status(400)
        .send({ message: "Formato inválido. Use JPEG, PNG ou WebP" });
    }

    let totalSize = 0;
    const { PassThrough } = await import("stream");
    const passThrough = new PassThrough();

    file.file.on("data", (chunk: Buffer) => {
      totalSize += chunk.length;
      if (totalSize > MAX_FILE_SIZE) {
        file.file.destroy();
        passThrough.destroy(new Error("FILE_TOO_LARGE"));
      }
    });

    file.file.pipe(passThrough);

    const publicUrl = await UploadService.uploadProfilePicture(
      id,
      passThrough,
      file.mimetype
    );

    return reply.status(200).send({ photoUrl: publicUrl });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "FILE_TOO_LARGE") {
        return reply.status(400).send({ message: "Arquivo muito grande. Máximo 5MB" });
      }
      if ((error as NodeJS.ErrnoException).code === "P2025") {
        return reply.status(404).send({ message: "Estabelecimento não encontrado" });
      }
    }

    console.error("Upload profile picture error:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

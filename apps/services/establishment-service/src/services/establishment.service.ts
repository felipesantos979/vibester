import prismaClient from "../prisma/index";
import {
  EstablishmentInterface,
  EstablishmentProfileResponse,
  ListEstablishmentsFilters,
  OpeningHour,
} from "../types/establishment.types";

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function buildWhere(filters: ListEstablishmentsFilters) {
  return {
    category: filters.category
      ? {
        equals: filters.category,
        mode: "insensitive" as const,
      }
      : undefined,

    averageRating:
      filters.minRating !== undefined
        ? {
          gte: filters.minRating,
        }
        : undefined,

    name: filters.search
      ? {
        contains: filters.search,
        mode: "insensitive" as const,
      }
      : undefined,
  };
}

function hasLocation(filters: ListEstablishmentsFilters): boolean {
  return filters.userLat !== undefined && filters.userLon !== undefined;
}

function addDistanceIfNeeded(
  establishments: EstablishmentInterface[],
  filters: ListEstablishmentsFilters
): EstablishmentInterface[] {
  if (!hasLocation(filters)) {
    return establishments;
  }

  return establishments.map((establishment) => {
    const distance = calculateDistance(
      filters.userLat!,
      filters.userLon!,
      establishment.latitude,
      establishment.longitude
    );

    return {
      ...establishment,
      distanceTo: distance,
    };
  });
}

function sortEstablishments(
  establishments: EstablishmentInterface[],
  filters: ListEstablishmentsFilters
): EstablishmentInterface[] {
  const canSortByDistance = hasLocation(filters);

  if (filters.sortBy === "distance" && !canSortByDistance) {
    throw new Error("Latitude and longitude are required to sort by distance");
  }

  const sortOptions = {
    name: () =>
      establishments.sort((a, b) => a.name.localeCompare(b.name)),

    rating: () =>
      establishments.sort((a, b) => b.averageRating - a.averageRating),

    distance: () =>
      establishments.sort(
        (a, b) => (a.distanceTo ?? 0) - (b.distanceTo ?? 0)
      ),
  };

  if (filters.sortBy) {
    return sortOptions[filters.sortBy]();
  }

  if (canSortByDistance) {
    return sortOptions.distance();
  }

  return establishments;
}

export class EstablishmentService {
  static async listEstablishments(
    filters: ListEstablishmentsFilters
  ): Promise<EstablishmentInterface[]> {
    const establishments = await prismaClient.establishment.findMany({
      where: buildWhere(filters),
    });

    const establishmentsWithDistance = addDistanceIfNeeded(
      establishments,
      filters
    );

    return sortEstablishments(establishmentsWithDistance, filters);
  }

  static async updateRating(id: string, newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw new Error("INVALID_RATING");
    }

    const establishment = await prismaClient.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      throw new Error("ESTABLISHMENT_NOT_FOUND");
    }

    return prismaClient.establishment.update({
      where: { id },
      data: {
        averageRating: newRating,
      },
    });
  }

  static async getEstablishmentProfile(
    id: string
  ): Promise<EstablishmentProfileResponse> {
    const establishment = await prismaClient.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      throw new Error("Establishment not found");
    }

    return {
      icon: establishment.photoUrl,
      name: establishment.name,
      banner: establishment.bannerUrl,
      location: {
        latitude: establishment.latitude,
        longitude: establishment.longitude,
      },
      category: establishment.category,
      priceIndicator: establishment.priceIndicator,
      rating: establishment.averageRating,
    };
  }

  static async listOpenEstablishments() {
    const establishments = await prismaClient.establishment.findMany({
      include: {
        openingHours: true,
      },
    });

    const now = new Date();

    return establishments.filter((establishment) =>
      this.isEstablishmentOpen(establishment.openingHours, now)
    );
  }

  private static isEstablishmentOpen(openingHours: OpeningHour[], now: Date) {
    const currentDay = now.getDay();
    const previousDay = currentDay === 0 ? 6 : currentDay - 1;
    const currentTime = this.formatTime(now);

    return openingHours.some((hour) => {
      const crossesMidnight = hour.closeTime < hour.openTime;

      if (!crossesMidnight) {
        return (
          hour.dayOfWeek === currentDay &&
          currentTime >= hour.openTime &&
          currentTime <= hour.closeTime
        );
      }

      return (
        (hour.dayOfWeek === currentDay && currentTime >= hour.openTime) ||
        (hour.dayOfWeek === previousDay && currentTime <= hour.closeTime)
      );
    });
  }

  private static formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }
}
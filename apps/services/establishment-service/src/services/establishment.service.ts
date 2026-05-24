import prismaClient from "../prisma/index";
import { EstablishmentInterface } from "../types/establishment.types";

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export class EstablishmentService {
  static async listEstablishments(userLat?: number, userLon?: number) {
    const establishments = await prismaClient.establishment.findMany();

    if (userLat !== undefined && userLon !== undefined) {
      const withDistance = establishments.map(est => {
        const distance = calculateDistance(userLat, userLon, est.latitude, est.longitude);
        return {
          ...est,
          distanceTo: distance
        };
      });

      withDistance.sort((a, b) => a.distanceTo - b.distanceTo);
      return withDistance;
    }

    return establishments;
  }

  static async updateRating(id: string, newRating: number) {
    return await prismaClient.establishment.update({
      where: { id },
      data: {
        averageRating: newRating
      }
    });
  }

  static async getEstablishmentProfile(id: string): Promise<import("../types/establishment.types").EstablishmentProfileResponse> {
    const establishment = await prismaClient.establishment.findUnique({
      where: { id }
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
        longitude: establishment.longitude
      },
      category: establishment.category,
      priceIndicator: establishment.priceIndicator,
      rating: establishment.averageRating
    };
  }
}

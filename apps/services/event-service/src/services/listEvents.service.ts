import prismaClient from "../prisma";
import { ListEventsInput } from "../types/event.types";

export function calculateDistance(userLat: number, userLon: number, eventLat: number, eventLong: number): number {
  const R = 6371;
  const dLat = deg2rad(eventLat - userLat);
  const dLon = deg2rad(eventLong - userLon);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(eventLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export class ListEventsService {
  async listEvents(input: ListEventsInput) {
    const radiusKm = input.radiusKm ?? 10;

    const events = prismaClient.event.findMany({
      select: {
        photoUrl: true,
        name: true,
        location: true,
        startDate: true,
        totalConfirmed: true,
        latitude: true,
        longitude: true,
      },
      
      orderBy: {
        startDate: "asc"
      }
    });

    const nearbyEvents = (await events).map((event) => {
      const distanceKm = calculateDistance(input.latitude, input.longitude, event.latitude, event.longitude);

      return {
        ...event,
        distanceKm
      };
    }).filter((event) => event.distanceKm <= radiusKm).sort((a, b) => a.distanceKm - b.distanceKm);

    return nearbyEvents;
  }
}
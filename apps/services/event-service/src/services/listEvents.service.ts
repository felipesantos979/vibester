import prismaClient from "../prisma";
import { ListEventsInput } from "../types/event.types";

export function calculateDistance(
    userLat: number,
    userLon: number,
    eventLat: number,
    eventLon: number,
): number {
    const R = 6371;
    const dLat = deg2rad(eventLat - userLat);
    const dLon = deg2rad(eventLon - userLon);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(userLat)) *
            Math.cos(deg2rad(eventLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export class ListEventsService {
    async listEvents(input: ListEventsInput) {
        const radiusKm = input.radiusKm ?? 10;

        // Bounding-box pre-filter using indexes on (latitude, longitude);
        // Haversine in JS then applies precise great-circle filtering.
        const deltaLat = radiusKm / 111.0;
        const deltaLon = radiusKm / (111.0 * Math.cos(deg2rad(input.latitude)));

        const candidates = await prismaClient.event.findMany({
            where: {
                latitude: {
                    gte: input.latitude - deltaLat,
                    lte: input.latitude + deltaLat,
                },
                longitude: {
                    gte: input.longitude - deltaLon,
                    lte: input.longitude + deltaLon,
                },
            },
            orderBy: { startDate: "asc" },
        });

        return candidates
            .map((event) => ({
                ...event,
                distanceKm: calculateDistance(
                    input.latitude,
                    input.longitude,
                    event.latitude,
                    event.longitude,
                ),
            }))
            .filter((e) => e.distanceKm <= radiusKm)
            .sort((a, b) => a.distanceKm - b.distanceKm);
    }
}

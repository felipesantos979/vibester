import prismaClient from "../prisma";
import { ListEstablishmentsInput } from "../types/establishment.types";


function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

function calculateDistance(
    userLat: number,
    userLon: number,
    estLat: number,
    estLon: number,
): number {
    const R = 6371;
    const dLat = deg2rad(estLat - userLat);
    const dLon = deg2rad(estLon - userLon);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(userLat)) *
            Math.cos(deg2rad(estLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export class ListEstablishmentsService {
    async listEstablishments(input: ListEstablishmentsInput) {
        const radiusKm = input.radiusKm ?? 10;

        const deltaLat = radiusKm / 111.0;
        const deltaLon = radiusKm / (111.0 * Math.cos(deg2rad(input.latitude)));

        const candidates = await prismaClient.establishment.findMany({
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
        });

        return candidates
            .map((est) => ({
                ...est,
                distanceTo: calculateDistance(
                    input.latitude,
                    input.longitude,
                    est.latitude,
                    est.longitude,
                ),
            }))
            .filter((e) => e.distanceTo <= radiusKm)
            .sort((a, b) => a.distanceTo - b.distanceTo);
    }
}
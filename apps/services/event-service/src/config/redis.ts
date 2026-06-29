import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
    connectTimeout: 2000,
});

redis.on("error", (err: Error) => {
    console.error("[Redis] connection error:", err.message);
});

export async function cacheAside<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>,
): Promise<T> {
    try {
        const cached = await redis.get(key);
        if (cached !== null) return JSON.parse(cached) as T;
    } catch { /* Redis indisponível — vai direto ao banco */ }

    const data = await fetchFn();

    try {
        await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
    } catch { /* ignora falha ao gravar no cache */ }

    return data;
}

/** Gera chave determinística para cache de eventos próximos (~1 km de precisão). */
export function nearbyKey(lat: number, lon: number, radiusKm: number): string {
    const rLat = Math.round(lat * 100) / 100;
    const rLon = Math.round(lon * 100) / 100;
    return `events:nearby:${rLat}:${rLon}:${radiusKm}`;
}

/** Apaga todas as chaves de cache de eventos próximos. */
export async function invalidateNearbyCache(): Promise<void> {
    try {
        const keys = await redis.keys("events:nearby:*");
        if (keys.length > 0) await redis.del(...keys);
    } catch { /* ignora falha na invalidação */ }
}

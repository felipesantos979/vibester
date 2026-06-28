import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    lazyConnect: true,
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

    // Fire-and-forget: não bloqueia a resposta aguardando confirmação do Redis
    redis.set(key, JSON.stringify(data), "EX", ttlSeconds).catch(() => {});

    return data;
}

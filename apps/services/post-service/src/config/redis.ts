import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.redis_url, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
    connectTimeout: 2000,
});

redis.on("error", (err: Error) => {
    console.error(JSON.stringify({ level: "error", service: "redis", msg: err.message }));
});

export async function cacheAside<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>,
): Promise<T> {
    try {
        const cached = await redis.get(key);
        if (cached !== null) return JSON.parse(cached) as T;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(JSON.stringify({ level: "warn", service: "redis", op: "get", key, msg }));
    }

    const data = await fetchFn();

    try {
        await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(JSON.stringify({ level: "warn", service: "redis", op: "set", key, msg }));
    }

    return data;
}

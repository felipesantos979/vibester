import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
  enableOfflineQueue: false,
  connectTimeout: 2000,
});

redis.on("error", (err: Error) => {
  console.error("[Redis] connection error:", err.message);
});

const inFlight = new Map<string, Promise<unknown>>();

export async function cacheAside<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached !== null) return JSON.parse(cached) as T;
  } catch { /* Redis unavailable — proceeds to DB */ }

  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetchFn()
    .then(async (data) => {
      try {
        await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
      } catch { /* ignores write failure */ }
      return data;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise as Promise<T>;
}

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    await redis.ping();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[Redis] could not connect on startup:", msg);
  }
}

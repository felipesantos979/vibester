import { vi } from "vitest";

vi.mock("../../src/config/env", () => ({
  env: {
    PORT: 3002,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    REDIS_URL: "redis://localhost:6379",
    JWT_SECRET: "unit-test-secret-key-min-length",
    CORS_ORIGIN: "",
    SWAGGER_ENABLED: false,
    SERP_API_KEY: "test-serp-key",
    r2_account_id: "test-r2-account",
    r2_access_key_id: "test-r2-key-id",
    r2_secret_access_key: "test-r2-secret",
    r2_bucket_name: "test-bucket",
    r2_public_url: "https://test.r2.dev",
  },
}));

vi.mock("../../src/config/redis", async () => {
  const { default: RedisMock } = await import("ioredis-mock");
  const redisMock = new RedisMock();

  const isoDateRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  const dateReviver = (_k: string, v: unknown) =>
    typeof v === "string" && isoDateRe.test(v) ? new Date(v) : v;

  const inFlight = new Map<string, Promise<unknown>>();

  return {
    redis: redisMock,
    connectRedis: async () => {},
    cacheAside: async <T>(
      key: string,
      ttl: number,
      fetchFn: () => Promise<T>
    ): Promise<T> => {
      try {
        const cached = await redisMock.get(key);
        if (cached !== null) return JSON.parse(cached, dateReviver) as T;
      } catch {}

      const existing = inFlight.get(key);
      if (existing) return existing as Promise<T>;

      const promise = fetchFn()
        .then(async (data) => {
          try {
            await redisMock.set(key, JSON.stringify(data), "EX", ttl);
          } catch {}
          return data;
        })
        .finally(() => inFlight.delete(key));

      inFlight.set(key, promise);
      return promise as Promise<T>;
    },
  };
});

import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3002),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(1),
  CORS_ORIGIN: z.string().optional().default(""),
  SWAGGER_ENABLED: z.coerce.boolean().default(false),
  SERP_API_KEY: z.string(),
  r2_account_id: z.string(),
  r2_access_key_id: z.string(),
  r2_secret_access_key: z.string(),
  r2_bucket_name: z.string(),
  r2_public_url: z.string(),
  KAFKA_BROKERS: z.string().default("kafka:9092"),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  process.exit(1);
}

export const env = _env.data;

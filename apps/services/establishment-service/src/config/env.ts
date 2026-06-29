import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3003),
  DATABASE_URL: z.string().url(),
  SERP_API_KEY: z.string(),
  r2_account_id: z.string(),
  r2_access_key_id: z.string(),
  r2_secret_access_key: z.string(),
  r2_bucket_name: z.string(),
  r2_public_url: z.string()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  process.exit(1);
}

export const env = _env.data;

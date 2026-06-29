import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("3000"),
    R2_ACCOUNT_ID: z.string().min(1, "R2_ACCOUNT_ID é obrigatório"),
    R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID é obrigatório"),
    R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY é obrigatório"),
    R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME é obrigatório"),
    R2_PUBLIC_URL: z.string().min(1, "R2_PUBLIC_URL é obrigatório"),
    ASTRA_SECURE_CONNECT_BUNDLE: z.string().min(1, "ASTRA_SECURE_CONNECT_BUNDLE é obrigatório"),
    ASTRA_CLIENT_ID: z.string().min(1, "ASTRA_CLIENT_ID é obrigatório"),
    ASTRA_CLIENT_SECRET: z.string().min(1, "ASTRA_CLIENT_SECRET é obrigatório"),
    ASTRA_TOKEN: z.string().min(1, "ASTRA_TOKEN é obrigatório"),
    ASTRA_KEYSPACE: z.string().min(1, "ASTRA_KEYSPACE é obrigatório"),
    KAFKA_BROKERS: z.string().min(1, "KAFKA_BROKERS é obrigatório"),
    REDIS_URL: z.string().url("REDIS_URL deve ser uma URL válida").default("redis://localhost:6379"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("[ENV] Variáveis de ambiente inválidas:", JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

const _env = parsed.data;

export const env = {
    port: _env.PORT,
    r2_account_id: _env.R2_ACCOUNT_ID,
    r2_access_key_id: _env.R2_ACCESS_KEY_ID,
    r2_secret_access_key: _env.R2_SECRET_ACCESS_KEY,
    r2_bucket_name: _env.R2_BUCKET_NAME,
    r2_public_url: _env.R2_PUBLIC_URL,
    secure_connect_bundle: _env.ASTRA_SECURE_CONNECT_BUNDLE,
    astra_client_id: _env.ASTRA_CLIENT_ID,
    astra_client_secret: _env.ASTRA_CLIENT_SECRET,
    astra_token: _env.ASTRA_TOKEN,
    keyspace: _env.ASTRA_KEYSPACE,
    kafka_brokers: _env.KAFKA_BROKERS,
    redis_url: _env.REDIS_URL,
};

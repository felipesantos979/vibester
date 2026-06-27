import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT,
    astra_keyspace: process.env.ASTRA_KEYSPACE,
    r2_account_id: process.env.R2_ACCOUNT_ID,
    r2_access_key_id: process.env.R2_ACCESS_KEY_ID,
    r2_secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
    r2_bucket_name: process.env.R2_BUCKET_NAME,
    r2_public_url: process.env.R2_PUBLIC_URL,
    secure_connect_bundle: process.env.ASTRA_SECURE_CONNECT_BUNDLE!,
    astra_client_id: process.env.ASTRA_CLIENT_ID!,
    astra_client_secret: process.env.ASTRA_CLIENT_SECRET!,
    astra_token: process.env.ASTRA_TOKEN!,
    keyspace: process.env.ASTRA_KEYSPACE!,
    kafka_brokers: process.env.KAFKA_BROKERS!
}
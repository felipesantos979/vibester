import dotenv from "dotenv";

dotenv.config();

export const env = {
    secure_connect_bundle: process.env.ASTRA_SECURE_CONNECT_BUNDLE!,
    astra_client_id: process.env.ASTRA_CLIENT_ID!,
    astra_client_secret: process.env.ASTRA_CLIENT_SECRET!,
    astra_token: process.env.ASTRA_TOKEN!,
    keyspace: process.env.ASTRA_KEYSPACE!,
    kafka_brokers: process.env.KAFKA_BROKERS!
}
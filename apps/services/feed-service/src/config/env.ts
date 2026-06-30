import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("[ENV] JWT_SECRET é obrigatório");
    process.exit(1);
}

export const env = {
    secure_connect_bundle: process.env.ASTRA_SECURE_CONNECT_BUNDLE!,
    astra_client_id: process.env.ASTRA_CLIENT_ID!,
    astra_client_secret: process.env.ASTRA_CLIENT_SECRET!,
    astra_token: process.env.ASTRA_TOKEN!,
    keyspace: process.env.ASTRA_KEYSPACE!,
    kafka_brokers: process.env.KAFKA_BROKERS!,
    jwt_secret: process.env.JWT_SECRET!,
}
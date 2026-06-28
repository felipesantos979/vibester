import { Client } from "cassandra-driver";
import { env } from "./env";

export const cassandraClient = new Client({
    cloud: {
        secureConnectBundle: env.secure_connect_bundle,
    },
    credentials: {
        username: env.astra_client_id,
        password: env.astra_client_secret,
    },
    keyspace: env.astra_keyspace,
});
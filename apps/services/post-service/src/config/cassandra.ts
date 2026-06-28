import { Client } from "cassandra-driver";
import { env } from "./env";

let _client: Client | null = null;

export const getCassandraClient = (): Client => {
    if (!_client) {
        _client = new Client({
            cloud: {
                secureConnectBundle: env.secure_connect_bundle,
            },
            credentials: {
                username: env.astra_client_id,
                password: env.astra_client_secret,
            },
            keyspace: env.keyspace,
        });
    }
    return _client;
};

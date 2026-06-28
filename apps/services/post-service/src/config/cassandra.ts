import { Client } from "cassandra-driver";
import { env } from "./env";

let _client: Client | null = null;

export const getCassandraClient = (): Client => {
    if (!_client) {
        _client = new Client({
            contactPoints: env.cassandra_contact_point?.split(","),
            localDataCenter: env.cassandra_datacenter,
            keyspace: env.cassandra_keyspace,
        });
    }
    return _client;
};
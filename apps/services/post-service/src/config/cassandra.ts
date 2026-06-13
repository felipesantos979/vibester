import { Client } from "cassandra-driver";
import { env } from "./env";

export const cassandraClient = new Client({
    contactPoints: env.cassandra_contact_point?.split(","),
    localDataCenter: env.cassandra_datacenter,
    keyspace: env.cassandra_keyspace,
})
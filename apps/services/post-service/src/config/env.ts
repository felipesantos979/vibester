import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT,
    cassandra_contact_point: process.env.CASSANDRA_CONTACT_POINT,
    cassandra_keyspace: process.env.CASSANDRA_KEYSPACE,
    cassandra_datacenter: process.env.CASSANDRA_DATACENTER
}
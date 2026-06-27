import cassandra from "cassandra-driver"
import { env } from "./env";
import path from "node:path";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const cassandraClient = new cassandra.Client({
  cloud: {
    secureConnectBundle: path.resolve(env.secure_connect_bundle),
  },
  credentials: {
    username: 'token',
    password: env.astra_token,
  },
  keyspace: env.keyspace,
});
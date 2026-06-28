import cassandra from "cassandra-driver";
import { env } from "./env";
import path from "node:path";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let _client: cassandra.Client | null = null;

export const getCassandraClient = (): cassandra.Client => {
  if (!_client) {
    _client = new cassandra.Client({
      cloud: {
        secureConnectBundle: path.resolve(env.secure_connect_bundle),
      },
      credentials: {
        username: "token",
        password: env.astra_token,
      },
      keyspace: env.keyspace,
    });
  }
  return _client;
};

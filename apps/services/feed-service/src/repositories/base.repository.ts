import { getCassandraClient } from "../config/cassandra";

export abstract class BaseRepository {
  protected async execute(query: string, params: unknown[] = []) {
    return getCassandraClient().execute(query, params, { prepare: true });
  }
}

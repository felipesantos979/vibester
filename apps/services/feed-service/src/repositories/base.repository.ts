import { cassandraClient } from "../config/cassandra";

export abstract class BaseRepository {
    protected async execute(
        query: string,
        params: unknown[] = []
    ) {
        return cassandraClient.execute(
            query,
            params,
            { prepare: true }
        );
    }
}
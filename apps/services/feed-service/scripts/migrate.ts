import fs from "node:fs/promises";
import path from "node:path";
import { cassandraClient } from "../src/config/cassandra";

const MIGRATIONS_PATH = path.resolve("migrations");

async function migrate() {
    await cassandraClient.connect();

    const files = (await fs.readdir(MIGRATIONS_PATH))
        .filter(file => file.endsWith(".cql"))
        .sort();

    for (const file of files) {
        const version = file.split("__")[0];

        const existing = await cassandraClient.execute(
            `
                SELECT version
                FROM feed_keyspace.schema_migrations
                WHERE version = ?;
            `,
            [version],
            { prepare: true }
        );

        if (existing.rows.length > 0) {
            console.log(`Skipping ${version}`);
            continue;
        }

        const migration = (await fs.readFile(
            path.join(MIGRATIONS_PATH, file),
            "utf-8"
        )).trim();

        console.log(`Running ${file}`);

        await cassandraClient.execute(migration);

        await cassandraClient.execute(
            `
                INSERT INTO feed_keyspace.schema_migrations (
                    version,
                    executed_at
                )
                VALUES (?, toTimestamp(now()));
            `,
            [version],
            { prepare: true }
        );

        console.log(`${version} applied`);
    }

    await cassandraClient.shutdown();
}

migrate().catch(error => {
    console.error(error);
    process.exit(1);
});
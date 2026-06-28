import fs from "node:fs/promises";
import path from "node:path";
import { getCassandraClient } from "../src/config/cassandra";

const MIGRATIONS_PATH = path.resolve("migrations");

async function migrate() {
    await getCassandraClient().connect();

    const files = (await fs.readdir(MIGRATIONS_PATH))
        .filter(file => file.endsWith(".cql"))
        .sort();

    for (const file of files) {
        const version = file.split("__")[0];

        const existing = await getCassandraClient().execute(
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

        await getCassandraClient().execute(migration);

        await getCassandraClient().execute(
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

    await getCassandraClient().shutdown();
}

migrate().catch(error => {
    console.error(error);
    process.exit(1);
});
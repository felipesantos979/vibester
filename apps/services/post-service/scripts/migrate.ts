import fs from "fs";
import path from "path";
import "dotenv/config"
import { Client } from "cassandra-driver";

const KEYSPACE = process.env.ASTRA_KEYSPACE;
const BUNDLE_PATH = process.env.ASTRA_SECURE_CONNECT_BUNDLE;
const CLIENT_ID = process.env.ASTRA_CLIENT_ID;
const CLIENT_SECRET = process.env.ASTRA_CLIENT_SECRET;

if (!KEYSPACE) throw new Error("ASTRA_KEYSPACE não definida");
if (!BUNDLE_PATH) throw new Error("ASTRA_BUNDLE_PATH não definida");
if (!CLIENT_ID) throw new Error("ASTRA_CLIENT_ID não definida");
if (!CLIENT_SECRET) throw new Error("ASTRA_CLIENT_SECRET não definida");

const client = new Client({
    cloud: {
        secureConnectBundle: BUNDLE_PATH,
    },
    credentials: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
    },
    keyspace: KEYSPACE,
});

async function ensureMigrationTable() {
    await client.execute(
        `
            CREATE TABLE IF NOT EXISTS ${KEYSPACE}.schema_migrations (
                version text PRIMARY KEY,
                executed_at timestamp
            );
        `
    );
}

async function getExecutedMigrations(): Promise<Set<string>> {
    const result = await client.execute(
        `SELECT version FROM ${KEYSPACE}.schema_migrations`
    );

    return new Set(result.rows.map((row) => row.version as string));
}

async function registerMigration(version: string) {
    await client.execute(
        `
            INSERT INTO ${KEYSPACE}.schema_migrations
            (version, executed_at)
            VALUES (?, toTimestamp(now()))
        `,
        [version],
        { prepare: true }
    );
}

async function run() {
    await client.connect();
    console.log(KEYSPACE);

    await ensureMigrationTable();

    const executed = await getExecutedMigrations();

    const migrationsPath = path.resolve("migrations");

    const files = fs
        .readdirSync(migrationsPath)
        .filter((file) => file.endsWith(".cql"))
        .sort();

    for (const file of files) {
        const version = file.split("__")[0];

        if (executed.has(version)) { continue; }

        console.log(`${file}`);

        const content = fs.readFileSync(
            path.join(migrationsPath, file),
            "utf8"
        );

        await client.execute(content);
        await registerMigration(version);

        console.log(`${version} executada`);
    }

    console.log("Migrate Finalizado");

    await client.shutdown();
}

run().catch((error) => {
    console.error("Erro ao executar o migrate");
    console.error(error);
    process.exit(1);
});
import fs from "fs";
import path from "path";
import "dotenv/config"
import { Client } from "cassandra-driver";

const KEYSPACE = process.env.CASSANDRA_KEYSPACE;
const CONTACT_POINT = process.env.CASSANDRA_CONTACT_POINT
const DATA_CENTER = process.env.CASSANDRA_DATACENTER;

if (!CONTACT_POINT) {
  throw new Error("CASSANDRA_CONTACT_POINT não definida");
}

if (!DATA_CENTER) {
  throw new Error("CASSANDRA_DATACENTER não definida");
}

if (!KEYSPACE){
  throw new Error("KEYSPACE não definida");
}

const client = new Client({
  contactPoints: [CONTACT_POINT!],
  localDataCenter: DATA_CENTER!,
});

async function ensureKeyspace() {
  await client.execute(
    `
      CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      };
    `
  );
}

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

  return new Set(
    result.rows.map((row) => row.version as string)
  );
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

  await ensureKeyspace();
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
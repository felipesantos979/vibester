CREATE TABLE IF NOT EXISTS feed_keyspace.schema_migrations (
    version text PRIMARY KEY,
    executed_at timestamp
);
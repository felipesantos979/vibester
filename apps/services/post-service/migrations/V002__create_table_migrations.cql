CREATE TABLE IF NOT EXISTS post_keyspace.schema_migrations (
    version text PRIMARY KEY,
    executed_at timestamp
);
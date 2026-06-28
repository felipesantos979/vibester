CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    executed_at timestamp
);
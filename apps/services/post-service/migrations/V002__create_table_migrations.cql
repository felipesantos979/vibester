CREATE TABLE IF NOT EXISTS vibester_posts.schema_migrations (
    version text PRIMARY KEY,
    executed_at timestamp
);
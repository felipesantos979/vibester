CREATE TABLE IF NOT EXISTS feed_keyspace.feed_entries_by_post (
    post_id uuid,
    user_id uuid,
    created_at timestamp,
    PRIMARY KEY ((post_id), user_id, created_at)
);
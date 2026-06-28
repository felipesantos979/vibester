CREATE TABLE IF NOT EXISTS post_keyspace.likes_by_user (
    user_id uuid,
    liked_at timestamp,
    post_id uuid,
    PRIMARY KEY (user_id, liked_at, post_id)
) WITH CLUSTERING ORDER BY (liked_at DESC);
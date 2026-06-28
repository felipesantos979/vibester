CREATE TABLE IF NOT EXISTS post_keyspace.likes_by_post (
    post_id uuid,
    user_id uuid,
    liked_at timestamp,
    PRIMARY KEY (post_id, user_id)
);
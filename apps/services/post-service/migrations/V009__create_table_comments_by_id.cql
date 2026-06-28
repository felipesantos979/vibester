CREATE TABLE IF NOT EXISTS post_keyspace.comments_by_id (
    comment_id uuid PRIMARY KEY,
    post_id uuid,
    user_id uuid,
    content text,
    is_deleted boolean,
    created_at timestamp,
    updated_at timestamp
);
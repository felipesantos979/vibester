CREATE TABLE IF NOT EXISTS comments_by_user (
    user_id uuid,
    created_at timestamp,
    comment_id uuid,
    post_id uuid,
    content text,
    updated_at timestamp,
    is_deleted boolean,

    PRIMARY KEY (user_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
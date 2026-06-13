CREATE TABLE IF NOT EXISTS vibester_posts.comments_by_post (
    post_id uuid,
    created_at timestamp,
    comment_id uuid,
    user_id uuid,
    content text,
    updated_at timestamp,
    is_deleted boolean,

    PRIMARY KEY (post_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
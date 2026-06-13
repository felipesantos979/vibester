CREATE TABLE IF NOT EXISTS vibester_posts.posts_by_establishment (
    establishment_id uuid,
    created_at timestamp,
    post_id uuid,
    user_id uuid,
    image_urls list<text>,
    caption text,
    total_likes int,
    total_comments int,
    is_deleted boolean,
    updated_at timestamp,
    PRIMARY KEY (establishment_id, created_at, post_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
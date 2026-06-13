CREATE TABLE IF NOT EXISTS vibester_posts.posts_by_id (
    post_id uuid PRIMARY KEY,
    user_id uuid,
    establishment_id uuid,
    image_urls list<text>,
    caption text,
    total_likes int,
    total_comments int,
    is_deleted boolean,
    created_at timestamp,
    updated_at timestamp
);
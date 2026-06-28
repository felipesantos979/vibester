CREATE TABLE IF NOT EXISTS posts_by_id (
    post_id uuid PRIMARY KEY,

    -- dados do usuário
    user_id uuid,
    user_username text,
    user_profile_picture text,
    user_verified boolean,

    -- estabelecimento marcado (opcional)
    establishment_id uuid,
    establishment_name text,
    establishment_logo text,
    establishment_category text,

    -- conteúdo do post
    image_urls list<text>,
    caption text,
    tags set<text>,

    total_likes int,
    total_comments int,
    is_deleted boolean,
    created_at timestamp,
    updated_at timestamp
);
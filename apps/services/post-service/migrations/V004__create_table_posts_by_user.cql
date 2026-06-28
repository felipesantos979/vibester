CREATE TABLE IF NOT EXISTS posts_by_user (
    user_id uuid,
    created_at timestamp,
    post_id uuid,

    -- dados do usuário
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
    updated_at timestamp,

    PRIMARY KEY (user_id, created_at, post_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

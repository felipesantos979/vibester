CREATE TABLE IF NOT EXISTS feed_keyspace.feed_by_user (
    -- usuário dono do feed
    user_id uuid,

    -- ordenação do feed
    created_at timestamp,

    -- identificação do item
    item_id uuid,
    item_type text,

    -- autor do conteúdo (usuário ou estabelecimento)
    author_id uuid,
    author_username text,
    author_profile_picture text,
    author_verified boolean,

    -- estabelecimento marcado (quando tiver)
    establishment_id uuid,
    establishment_name text,
    establishment_logo text,
    establishment_category text,

    -- evento relacionado (quando existir)
    event_id uuid,
    event_title text,
    event_banner text,
    event_lineup set<text>,
    event_date timestamp,
    event_location text,
    event_organizer_name text,
    event_organizer_logo text,
    total_confirmed int,

    -- conteúdo
    title text,
    content text,
    image_urls list<text>,
    tags set<text>,


    total_likes int,
    total_comments int,
    is_sponsored boolean,
    is_deleted boolean,
    updated_at timestamp,

    PRIMARY KEY ((user_id), created_at, item_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
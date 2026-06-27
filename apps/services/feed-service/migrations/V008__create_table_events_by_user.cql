CREATE TABLE IF NOT EXISTS feed_keyspace.events_by_user (
    author_id uuid,

    created_at timestamp,
    event_id uuid,

    author_username text,
    author_profile_picture text,
    author_verified boolean,

    establishment_id uuid,
    establishment_name text,
    establishment_logo text,
    establishment_category text,

    event_title text,
    event_banner text,
    event_lineup list<text>,
    event_location text,
    event_date timestamp,
    event_organizer_name text,
    event_organizer_logo text,

    total_confirmed int,
    is_deleted boolean,
    
    updated_at timestamp,

    PRIMARY KEY ((author_id), created_at, event_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
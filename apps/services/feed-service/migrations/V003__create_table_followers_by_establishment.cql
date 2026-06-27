CREATE TABLE IF NOT EXISTS feed_keyspace.followers_by_establishment (
    establishment_id uuid,
    follower_id uuid,
    followed_at timestamp,

    PRIMARY KEY ((establishment_id), follower_id)
);
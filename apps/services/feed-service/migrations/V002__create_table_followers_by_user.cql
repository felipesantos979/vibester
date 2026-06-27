CREATE TABLE IF NOT EXISTS feed_keyspace.followers_by_user (
    user_id uuid,
    follower_id uuid,
    followed_at timestamp,

    PRIMARY KEY ((user_id), follower_id)
);

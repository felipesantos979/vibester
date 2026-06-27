CREATE TABLE IF NOT EXISTS feed_keyspace.attendees_by_event (
    event_id uuid,
    user_id uuid,
    confirmed_at timestamp,

    PRIMARY KEY ((event_id), user_id)
); 
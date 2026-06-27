CREATE TABLE IF NOT EXISTS payments (
    id          bigserial PRIMARY KEY,
    bill_id     text UNIQUE NOT NULL,
    external_id text,
    amount      integer NOT NULL,
    status      text NOT NULL DEFAULT 'PENDING',
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

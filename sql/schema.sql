-- ShopDB schema, built step by step

CREATE TABLE users (
    id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email   text NOT NULL UNIQUE,
    full_name   text NOT NULL,
    password_hash   text NOT NULL,
    is_active   boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT email_format CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
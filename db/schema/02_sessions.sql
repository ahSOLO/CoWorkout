DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY NOT NULL,
  scheduled_at timestamp NOT NULL,
  state VARCHAR(32) NOT NULL DEFAULT 'pending',
  scheduled_duration decimal,
  actual_duration decimal
);

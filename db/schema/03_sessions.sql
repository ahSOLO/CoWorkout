DROP TABLE IF EXISTS sessions CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY NOT NULL,
  session_uuid uuid DEFAULT uuid_generate_v4 (),
  scheduled_at TIMESTAMP NOT NULL,
  state VARCHAR(32) NOT NULL DEFAULT 'pending',
  scheduled_duration DECIMAL,
  actual_duration DECIMAL,
  workout_type_id INT REFERENCES workout_types(id) ON DELETE CASCADE,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE
);

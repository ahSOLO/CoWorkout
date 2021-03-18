DROP TABLE IF EXISTS user_workout_types CASCADE;

CREATE TABLE user_workout_types (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  workout_type_id INT REFERENCES workout_types(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS user_workout_interests CASCADE;

CREATE TABLE user_workout_interests (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  workout_interest_id INT REFERENCES workout_interests(id) ON DELETE CASCADE
);

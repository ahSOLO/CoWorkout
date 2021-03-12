DROP TABLE IF EXISTS user_workout_goals CASCADE;

CREATE TABLE user_workout_goals (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  workout_goal_id INT REFERENCES workout_goals(id) ON DELETE CASCADE
);

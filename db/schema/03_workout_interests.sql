DROP TABLE IF EXISTS workout_interests CASCADE;

CREATE TABLE workout_interests (
  id SERIAL PRIMARY KEY NOT NULL,
  interest VARCHAR(255) NOT NULL
);

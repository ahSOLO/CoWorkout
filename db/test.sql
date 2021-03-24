-- SELECT
--   session_users.user_id,
--   session_users.session_id,
--   sessions.session_uuid,
--   sessions.scheduled_at,
--   sessions.workout_type_id,
--   users.first_name,
--   users.last_name,
--   users.profile_image_url,
--   workout_types.type
-- FROM sessions
-- JOIN session_users
--   ON (sessions.id = session_users.session_id)
-- JOIN users
--   ON (users.id = session_users.user_id)
-- JOIN workout_types
--   ON (sessions.workout_type_id = workout_types.id)
-- WHERE sessions.session_UUID = '9b73858c-e7fd-40df-9bc8-97120e93e2d5';

SELECT
  sessions.session_uuid,
  sessions.scheduled_at,
  workout_types.type,
  ARRAY_AGG(users.first_name || ' ' || users.last_name || ' ' || users.profile_image_url ) as participants
FROM sessions
JOIN session_users
  ON (sessions.id = session_users.session_id)
JOIN users
  ON (users.id = session_users.user_id)
JOIN workout_types
  ON (sessions.workout_type_id = workout_types.id)
WHERE sessions.session_UUID = '9b73858c-e7fd-40df-9bc8-97120e93e2d5'
GROUP BY
  sessions.id,
  session_users.session_id,
  sessions.session_uuid,
  sessions.scheduled_at,
  sessions.workout_type_id,
  workout_types.type;

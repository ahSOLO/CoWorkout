const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    console.log('sessions');

    const user_id = req.query.user_id;
    const session_type = req.query.session_type;
    const filter = req.query.filter; 
    let start_date;
    let end_date;
    if (!req.query.start_date || !req.query.end_date) {
      start_date = new Date();
      days_before_sat = 5 - start_date.getDay();
      end_date = new Date();
      end_date.setTime(end_date.getTime() + days_before_sat * 24 * 60 * 60 * 1000);
    } else {
      start_date = new Date(req.query.start_date);
      end_date = new Date(req.query.end_date);
    }

    let query_string;

    if (filter === 'calendar') {
      if (session_type === 'transient') {
        query_string = `
        SELECT sessions.id AS session_id
             , ARRAY_AGG(session_users.user_id ORDER BY session_users.user_id) as session_users
             , sessions.scheduled_at as start_time
             , workout_types.type as workout_type
          FROM sessions 
          JOIN session_users
               ON sessions.id = session_users.session_id
          LEFT JOIN workout_types
               ON sessions.workout_type_id = workout_types.id
         WHERE sessions.state = 'pending'
           AND sessions.scheduled_at >= '${start_date.toISOString()}'
           AND sessions.scheduled_at <= '${end_date.toISOString()}'
           AND sessions.owner_id != ${user_id}
         GROUP BY 1, 3, 4
        HAVING COUNT(DISTINCT session_users.user_id) = 1;
        `
      } else {
        query_string = `
        SELECT sessions.id AS session_id
             , ARRAY_AGG(session_users.user_id ORDER BY session_users.user_id) as session_users
             , sessions.scheduled_at as start_time
             , workout_types.type as workout_type
         FROM sessions
         JOIN (SELECT session_id FROM session_users WHERE user_id = ${user_id}) us
              ON sessions.id = us.session_id
         JOIN session_users
              ON sessions.id = session_users.session_id
         LEFT JOIN workout_types
              ON sessions.workout_type_id = workout_types.id
        WHERE sessions.state = 'pending'
          AND sessions.scheduled_at >= '${start_date.toISOString()}'
          AND sessions.scheduled_at <= '${end_date.toISOString()}'
        GROUP BY 1, 3, 4
        `
      }
    }

    db.query(query_string)
      .then(data => {
        const sessions = data.rows;
        res.json({ sessions });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

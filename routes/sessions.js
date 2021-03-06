const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    const user_id = req.query.user_id;
    const filter = JSON.parse(req.query.filter);

    // console.log('Getting sessions data:', filter, user_id);
    
    let filterQueryAdditions = "";
    if (filter.activityId) {
      filterQueryAdditions += ` AND (sessions.workout_type_id = ${filter.activityId} OR sessions.workout_type_id IS NULL)`;
    }

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

    if (filter.type === 'transient') {
      query_string = `
      SELECT sessions.id AS session_id
            , ARRAY_AGG('{"user_id": ' || session_users.user_id || ', "user_first_name": "' || users.first_name || '", "user_profile_image_url": "' || users.profile_image_url || '"}' ORDER BY session_users.user_id) AS session_users            
            , sessions.scheduled_at AS start_time
            , workout_types.type AS workout_type
            , sessions.session_uuid as session_uuid
        FROM sessions 
        JOIN session_users
             ON sessions.id = session_users.session_id AND session_users.state = 'pending'
        JOIN users 
             ON session_users.user_id = users.id
        LEFT JOIN workout_types
             ON sessions.workout_type_id = workout_types.id
        WHERE sessions.state = 'pending'
          AND sessions.scheduled_at >= '${start_date.toISOString()}'
          AND sessions.scheduled_at <= '${end_date.toISOString()}'
          AND sessions.owner_id != ${user_id}
          ${filterQueryAdditions}
        GROUP BY 1, 3, 4
      HAVING COUNT(DISTINCT session_users.user_id) = 1;
      `
    } else if (filter.type === 'persistent') {
      query_string = `
      SELECT sessions.id AS session_id
            , ARRAY_AGG('{"user_id": ' || session_users.user_id || ', "user_first_name": "' || users.first_name || '", "user_profile_image_url": "' || users.profile_image_url || '"}' ORDER BY session_users.user_id) AS session_users
            , sessions.scheduled_at AS start_time
            , workout_types.type AS workout_type
            , sessions.session_uuid as session_uuid
        FROM sessions
        JOIN (SELECT session_id FROM session_users WHERE user_id = ${user_id} AND state = 'pending') us
             ON sessions.id = us.session_id
        JOIN session_users
             ON sessions.id = session_users.session_id AND session_users.state = 'pending'
        JOIN users 
             ON session_users.user_id = users.id
        LEFT JOIN workout_types
            ON sessions.workout_type_id = workout_types.id
      WHERE sessions.state = 'pending'
        AND sessions.scheduled_at >= '${start_date.toISOString()}'
        AND sessions.scheduled_at <= '${end_date.toISOString()}'
      GROUP BY 1, 3, 4;
      `
    } else if (filter.type === 'upcoming') {
      query_string = `
      SELECT sessions.id AS session_id
           , ARRAY_AGG('{"user_id": ' || session_users.user_id || ', "user_first_name": "' || users.first_name || '"}' ORDER BY session_users.user_id) AS session_users
           , sessions.scheduled_at AT TIME ZONE 'UTC' AS start_time
           , workout_types.type AS workout_type
           , sessions.session_uuid as session_uuid
        FROM sessions
        JOIN (SELECT session_id FROM session_users WHERE user_id = ${user_id} AND state = 'pending') us
             ON sessions.id = us.session_id
        JOIN session_users
             ON sessions.id = session_users.session_id AND session_users.state = 'pending'
        JOIN users 
             ON session_users.user_id = users.id
        LEFT JOIN workout_types
             ON sessions.workout_type_id = workout_types.id
       WHERE sessions.state = 'pending'
       AND sessions.scheduled_at > ( NOW() AT TIME ZONE 'UTC' - INTERVAL '15 minutes' )
       GROUP BY 1, 3, 4
       ORDER BY sessions.scheduled_at asc
       LIMIT 3;
      `

      // Note to implementor: make sure you add AT TIME ZONE 'UTC' to the query (see the upcoming query), and then on the react front end, import moment and use { moment(session.start_time).format("dddd, MMM Do [at] h:mm a") } to convert the retrieved start time to local time.
    } else if (filter.type === 'all') {
      query_string = `
      SELECT sessions.id AS session_id
           , sessions.state AS session_state
           , ARRAY_AGG(session_users.user_id ORDER BY session_users.user_id) AS session_users
           , sessions.scheduled_at AS start_time
           , workout_types.type AS workout_type
           , sessions.session_uuid as session_uuid
        FROM sessions
        JOIN (SELECT session_id FROM session_users WHERE user_id = 1) us
             ON sessions.id = us.session_id
        JOIN session_users
             ON sessions.id = session_users.session_id AND session_users.state = 'pending'
        LEFT JOIN workout_types
             ON sessions.workout_type_id = workout_types.id
       GROUP BY 1, 2, 4, 5
       ORDER BY sessions.scheduled_at asc;
      `

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
  
  // BOOK A NEW SESSION
  router.post("/", (req, res) => {

    let { user_id, activity, start_time } = req.body;

    console.log(user_id, activity, start_time);

    // set workout type id to null if user chose "any" activity. Conversion has to happen here instead of in front end to prevent visual display bug with matUI dropdowns.
    if (activity === 0) activity = null;

    const query_string1 = `
    INSERT INTO sessions (scheduled_at, workout_type_id, owner_id)
    VALUES ($1, $2, $3)
    RETURNING id;
    `
    const query_string2 = `
    INSERT INTO session_users (session_id, user_id)
    VALUES ($1, $2);
    `
    db.query(query_string1, [start_time, activity, user_id])
      .then( data => {
      const session_id = data.rows[0].id;
      console.log("Inserted sessions record");
      db.query(query_string2, [session_id, user_id])
        .then( data => {
          res.status(201).json(session_id);
          console.log("Inserted session_users record");
        })
        .catch(err => {
          console.log("Error inserting session_users record");
          res.status(500).send("Failure");
        });
      })
      .catch(err => {
        console.log("Error inserting sessions record:", err);
        res.status(500).send("Failure");
    });
  });

  router.get('/:sessionUUID', (req, res) => {
    const sessionUUID = req.params.sessionUUID;

    const query = `
    SELECT
      sessions.id,
      sessions.session_uuid,
      sessions.scheduled_at,
      workout_types.type,
      ARRAY_AGG(users.id || ' ' || users.user_uuid || ' ' || users.first_name || ' ' || users.last_name || ' ' || users.profile_image_url ) as participants
    FROM sessions
    JOIN session_users
      ON (sessions.id = session_users.session_id)
    JOIN users
      ON (users.id = session_users.user_id)
    LEFT OUTER JOIN workout_types
      ON (sessions.workout_type_id = workout_types.id)
    WHERE sessions.session_UUID = '${sessionUUID}'
    GROUP BY
      sessions.id,
      session_users.session_id,
      sessions.session_uuid,
      sessions.scheduled_at,
      sessions.workout_type_id,
      workout_types.type;`;

    db.query(query)
      .then((data) => {
        res.status(200).json(data.rows);
      })
  });

  router.post('/rate', (req, res) => {
    const feedbackString = req.body.params.feedback;
    const feedback = JSON.parse(feedbackString);
    console.log(feedback)
    const query1 = `
      UPDATE session_users
      SET state = '${feedback.partnerCompletion && "complete" || "incomplete"}'
      WHERE session_id = ${feedback.sessionID} AND user_id = ${feedback.ratedID};
    `;  
    const query2 = `
      INSERT INTO ratings VALUES
        (${feedback.sessionID}, ${feedback.raterID}, ${feedback.ratedID}, ${feedback.partnerRating});
    `;

    Promise.all([
      db.query(query1),
      db.query(query2)
    ])
      .then(() => {
        res.status(200).json({status: 'success'});
      })
      .catch(err => {
        console.log("Error adding records pertaining to feedback.");
        res.status(500).send("Failure");
      });
  });


  return router;
};

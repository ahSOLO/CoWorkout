const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {

    const user_id = req.query.user_id;

    const query_string = `
    SELECT users.id as user_id
         , users.first_name || ' ' || users.last_name as name
         , users.first_name as user_first_name
         , users.last_name as last_name
         , users.country
         , users.region
         , users.timezone
         , users.profile_image_url as user_profile_image_url
         , users.gender
         , STRING_AGG(DISTINCT wt.type, ', ') as fitness_interests
         , ARRAY_AGG(DISTINCT wt.type) as fitness_interests_array
         , STRING_AGG(DISTINCT wg.goal, ', ') as fitness_goals
         , ARRAY_AGG(DISTINCT wg.goal) as fitness_goals_array
         , COUNT(DISTINCT CASE WHEN su.state = 'complete' then su.session_id end) as completed_sessions
         , COUNT(DISTINCT CASE WHEN su.state = 'complete' then su.session_id end)::NUMERIC / COUNT(DISTINCT su.session_id) as completion_rate
         , AVG(sessions.actual_duration) as avg_session_length
         , CASE WHEN COUNT(DISTINCT CASE WHEN su.state = 'complete' then su.session_id end) >= 1 then TRUE else FALSE end as one_completed_badge
         , CASE WHEN COUNT(DISTINCT CASE WHEN su.state = 'complete' then su.session_id end) >= 10 then TRUE else FALSE end as ten_completed_badge
      FROM users
      LEFT JOIN user_workout_types uwt
           ON users.id = uwt.user_id
      LEFT JOIN workout_types wt
           ON uwt.workout_type_id = wt.id 
      LEFT JOIN user_workout_goals uwg
           ON users.id = uwg.user_id
      LEFT JOIN workout_goals wg
           ON uwg.workout_goal_id = wg.id
      LEFT JOIN session_users su
           ON users.id = su.user_id and su.state != 'pending'
      LEFT JOIN sessions
           ON su.session_id = sessions.id
     WHERE users.id = ${user_id}
     GROUP BY 1, 2, 3, 4, 5, 6;
    `

    db.query(query_string)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;
    const birth_date = req.body.birth_date;
    const country = req.body.country;
    const region = req.body.region;
    const timezone = req.body.timezone;
    const queryParams = [first_name, last_name, email, password, gender, birth_date, country, region, timezone];

    const queryString = `
    INSERT INTO users (first_name, last_name, email, password, gender, birth_date, country, region, timezone) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;

    let queryStringInterests = 'INSERT INTO user_workout_types (user_id, workout_type_id) VALUES '
    let queryStringGoals = 'INSERT INTO user_workout_goals (user_id, workout_goal_id) VALUES '

    let user_id;

    db.query(queryString, queryParams)
      .then((data) => {
        user_id = data.rows[0].id;
        let interests_added = 0;

        for (interest of req.body.interests) {
          if (interest.value) {
            queryStringInterests += `(${user_id}, ${interest.interest_id}), `;
            interests_added += 1;
          }
        }
        if (interests_added > 0) {
          queryStringInterests = queryStringInterests.slice(0, -2) + ';';
        } else {
          queryStringInterests = '';
        }
        console.log(queryStringInterests);

        return db.query(queryStringInterests);
      })
      .then((data) => {
        let goals_added = 0;

        for (goal of req.body.goals) {
          if (goal.value) {
            queryStringGoals += `(${user_id}, ${goal.goal_id}), `;
            goals_added += 1;
          }
        }
        if (goals_added > 0) {
          queryStringGoals = queryStringGoals.slice(0, -2) + ';';
        } else {
          queryStringGoals = '';
        }

        return db.query(queryStringGoals);
      })
      .then((data) => {
        res.status(200)
      })
      .catch(error => console.log(error));
  });

  router.put("/", (req, res) => {
    const user_id = req.body.user_id;
    const country = req.body.country;
    const region = req.body.region;
    const timezone = req.body.timezone;
    
    const interests = req.body.interests;
    const interests_to_add = [];
    let i = 1;

    for (interest in interests) {
      if (interests[interest]) {
        interests_to_add.push(i);
      }
      i += 1;
    }

    const goals = req.body.goals;
    const goals_to_add = [];
    let g = 1;

    for (goal in goals) {
      if (goals[goal]) {
        goals_to_add.push(g);
      }
      g += 1;
    }

    const queryString = `UPDATE users SET (country, region, timezone) = ('${country}', '${region}', '${timezone}') WHERE id = ${user_id} RETURNING *;`;

    const queryDeleteInterests = `DELETE FROM user_workout_types WHERE user_id = ${user_id};`;
    let queryInsertInterests = `INSERT INTO user_workout_types (user_id, workout_type_id) VALUES `

    const queryDeleteGoals = `DELETE FROM user_workout_goals WHERE user_id = ${user_id};`;
    let queryInsertGoals = `INSERT INTO user_workout_goals (user_id, workout_goal_id) VALUES `

    db.query(queryString)
      .then((data) => {
        return db.query(queryDeleteInterests);
      })
      .then((data) => {
        let interests_added = 0;
        for (interest of interests_to_add) {
          queryInsertInterests += `(${user_id}, ${interest}), `;
          interests_added += 1;
        }
        if (interests_added > 0) {
          queryInsertInterests = queryInsertInterests.slice(0, -2) + ';';
        } else {
          queryInsertInterests = '';
        }
        return db.query(queryInsertInterests);
      })
      .then((data) => {
        return db.query(queryDeleteGoals);
      })
      .then((data) => {
        let goals_added = 0;
        for (goal of goals_to_add) {
          queryInsertGoals += `(${user_id}, ${goal}), `;
          goals_added += 1;
        }
        if (goals_added > 0) {
          queryInsertGoals = queryInsertGoals.slice(0, -2) + ';';
        } else {
          queryInsertGoals = '';
        }
        return db.query(queryInsertGoals);
      })
      .then((data) => {
        res.status(201).send("Success");
      })
      .catch(error => console.log(error));
  });

  return router;

};

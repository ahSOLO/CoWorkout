const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
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

    let queryStringInterests = 'INSERT INTO user_workout_interests (user_id, workout_interest_id) VALUES '
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

  return router;

};

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
    const timezone = 'US/Pacific'; // hardcoded for now
    const queryParams = [first_name, last_name, email, password, gender, birth_date, country, region, timezone];

    const queryString = `
    INSERT INTO users (first_name, last_name, email, password, gender, birth_date, country, region, timezone) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;

    db.query(queryString, queryParams)
    .then((data) => {
      res
        .status(200)
        .json(data) 
    })
    .catch(error => console.log(error));
  });

  return router;

};

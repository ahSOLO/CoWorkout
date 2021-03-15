const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM user_workout_goals;`)
      .then(data => {
        const user_workout_goals = data.rows;
        res.json({ user_workout_goals });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

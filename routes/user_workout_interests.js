const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM user_workout_interests;`)
      .then(data => {
        const user_workout_interests = data.rows;
        res.json({ user_workout_interests });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

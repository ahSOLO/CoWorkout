const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    db.query(`SELECT id, email, password FROM users;`)
      .then(data => {
        const users = data.rows;
        for (const user of users) {
          if (user.email === email) {
            if (user.password === password) {
              res.json({ user });
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;

};

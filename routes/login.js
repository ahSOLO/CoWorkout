const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    db.query(`SELECT id as user_id, email, password FROM users;`)
      .then(data => {
        const users = data.rows;
        let user_found = false;

        for (const user of users) {
          if (user.email === email) {
            if (user.password === password) {
              user_found = true;
              res.json({ user });
            } 
          }
        }
        
        if (!user_found) {
          res.json({ user: undefined });
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

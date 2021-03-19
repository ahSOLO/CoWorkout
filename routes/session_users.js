const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM session_users;`)
      .then(data => {
        const session_users = data.rows;
        res.json({ session_users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD A NEW SESSION USER
  router.post("/", (req, res) => {

    let { user_id, session_id } = req.body;

    const query_string = `
    INSERT INTO session_users (session_id, user_id)
    VALUES ($1, $2);
    `
    db.query(query_string, [session_id, user_id])
      .then( data => {
        res.status(201).send("Success");
        console.log("Inserted session_users record");
      })
      .catch( err => {
        res.status(500).send("Failure");
        console.log("Error inserting session_users record");
      })
  });


  return router;
};

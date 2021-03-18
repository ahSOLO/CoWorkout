const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log('sessions');

    let start_time;
    let end_time;
    if (!req.query.start_time || !req.query.end_time) {
      start_time = new Date();
      days_before_sat = 5 - start_time.getDay();
      end_time = new Date();
      end_time.setTime(end_time.getTime() + days_before_sat * 24 * 60 * 60 * 1000);
    } else {
      start_time = req.query.start_time;
      end_time = req.query.end_time;
    }
    
    // console.log(start_time, end_time);

    const query = `SELECT * FROM sessions
    WHERE sessions.scheduled_at >= '${start_time}'
    AND sessions.scheduled_at <= '${end_time}';`;

    console.log(query);

    db.query(query)
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

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log('sessions');

    let start_date;
    let end_date;
    if (!req.query.start_date || !req.query.end_date) {
      start_date = new Date();
      days_before_sat = 5 - start_date.getDay();
      end_date = new Date();
      end_date.setTime(end_date.getTime() + days_before_sat * 24 * 60 * 60 * 1000);
    } else {
      start_date = req.query.start_date;
      end_date = req.query.end_date;
    }
    
    // console.log(start_date, end_date);

    const query = `SELECT * FROM sessions
    WHERE sessions.scheduled_at >= '${start_date}'
    AND sessions.scheduled_at <= '${end_date}';`;

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

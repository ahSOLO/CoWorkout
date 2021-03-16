// PG database client/connection setup
require('dotenv').config();

const { Pool } = require('pg');
const dbParams = require('../../lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Contains helper functions used by the main application.
const getUpcomingCurrentDaySessions = function(datetime) {

  db.query(
    `
    SELECT sessions.scheduled_at
         , sessions.state
         , sessions.scheduled_duration
         , sessions.owner_id
         , users.first_name as owner_first_name
         , users.profile_image_url as owner_avatar
      FROM sessions 
      JOIN users
        ON sessions.owner_id = users.id 
     WHERE sessions.scheduled_at > ${datetime}
       AND sessions.scheduled_at::date = ${datetime}
    `
  ).then(data => {
    console.log(data.rows);
  })
  
};

module.exports = {
  getUpcomingCurrentDaySessions
}

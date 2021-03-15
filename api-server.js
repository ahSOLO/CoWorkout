// Load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const express    = require("express");
const app        = express();

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

const users = require("./routes/users");
const sessions = require("./routes/sessions");
const workout_interests = require("./routes/workout_interests");
const workout_goals = require("./routes/workout_goals");
const user_workout_interests = require("./routes/user_workout_interests");
const user_workout_goals = require("./routes/user_workout_goals");
const session_users = require("./routes/session_users");
const ratings = require("./routes/ratings");

// Mount all resource routes
app.use("/api/users", users(db));
app.use("/api/sessions", sessions(db));
app.use("/api/workout_interests", workout_interests(db));
app.use("/api/workout_goals", workout_goals(db));
app.use("/api/user_workout_interests", user_workout_interests(db));
app.use("/api/user_workout_goals", user_workout_goals(db));
app.use("/api/session_users", session_users(db));
app.use("/api/ratings", ratings(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

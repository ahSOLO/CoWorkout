// Load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = 8081;
const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())

// Twilio config
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Mount resource routes
const users = require("./routes/users");
const sessions = require("./routes/sessions");
const workout_interests = require("./routes/workout_interests");
const workout_goals = require("./routes/workout_goals");
const user_workout_interests = require("./routes/user_workout_interests");
const user_workout_goals = require("./routes/user_workout_goals");
const session_users = require("./routes/session_users");
const ratings = require("./routes/ratings");

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

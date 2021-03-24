// Load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.LOCAL_PORT || 8081;
const express = require("express");
const app = express();
const cors = require('cors')
const path = require('path');

app.use(cors())

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

app.post('/test', (req, res) => {
  const feedback = req.body.feedback;
  console.log(req.body);
  res.end('Connection Ended..')
});

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Mount resource routes
const users = require("./routes/users");
const sessions = require("./routes/sessions");
const session_users = require("./routes/session_users");
const ratings = require("./routes/ratings");
const login = require("./routes/login");
const emails = require("./routes/emails");

app.use("/api/users", users(db));
app.use("/api/sessions", sessions(db));
app.use("/api/session_users", session_users(db));
app.use("/api/ratings", ratings(db));
app.use("/login", login(db));
app.use("/emails", emails(db));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

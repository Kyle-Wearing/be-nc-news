const express = require("express");
const { getTopics } = require("../controllers/topics.controller");
const { customErrors } = require("../controllers/error-handler");

const app = express();

app.get("/api/topics", getTopics);

app.use(customErrors);

module.exports = app;

const express = require("express");
const { getTopics } = require("../controllers/topics.controller");
const getEndpoints = require("../controllers/api.controller");
const { customErrors } = require("../controllers/error-handler");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

module.exports = app;

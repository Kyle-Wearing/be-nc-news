const express = require("express");
const { getTopics } = require("../controllers/topics.controller");
const getEndpoints = require("../controllers/api.controller");
const { customErrors, sqlErrors } = require("../controllers/error-handler");
const {
  getArticleById,
  getArticles,
} = require("../controllers/articles.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use(customErrors);
app.use(sqlErrors);

module.exports = app;

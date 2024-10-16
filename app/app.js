const express = require("express");
const { getTopics } = require("../controllers/topics.controller");
const getEndpoints = require("../controllers/api.controller");
const { customErrors, sqlErrors } = require("../controllers/error-handler");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("../controllers/comments.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(customErrors);
app.use(sqlErrors);

module.exports = app;

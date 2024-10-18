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
const { getUsers } = require("../controllers/users.controller");
const apiRouter = require("../routers/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors);
app.use(sqlErrors);

module.exports = app;

const apiRouter = require("express").Router();
const getEndpoints = require("../controllers/api.controller");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;

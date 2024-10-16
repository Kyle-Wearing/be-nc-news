const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles.model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;
  updateArticleById(article_id, req.body).then((article) => {
    res.status(200).send({ article });
  });
}

module.exports = { getArticleById, getArticles, patchArticleById };

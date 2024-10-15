const {
  selectArticleById,
  selectArticles,
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
    console.log(articles);
    res.status(200).send({ articles });
  });
}

module.exports = { getArticleById, getArticles };

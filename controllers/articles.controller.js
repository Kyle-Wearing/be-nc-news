const { selectArticleById } = require("../models/articles.model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      res.status(200).send({ article: rows });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };

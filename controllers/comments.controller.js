const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId } = require("../models/comments.model");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  const promises = [
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ];
  return Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCommentsByArticleId };

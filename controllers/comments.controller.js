const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.model");

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

function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const promises = [
    selectArticleById(article_id),
    insertCommentByArticleId(article_id, req.body),
  ];
  return Promise.all(promises)
    .then((result) => {
      console.log(result[1]);
      res.status(201).send({ comment: result[1] });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCommentsByArticleId, postCommentByArticleId };

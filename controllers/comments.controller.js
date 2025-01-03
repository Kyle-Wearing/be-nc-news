const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const promises = [
    selectCommentsByArticleId(article_id, limit, p),
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
      res.status(201).send({ comment: result[1] });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

function patchCommentById(req, res, next) {
  const { comment_id } = req.params;
  updateCommentById(comment_id, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  patchCommentById,
};

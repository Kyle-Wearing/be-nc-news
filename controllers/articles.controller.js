const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
  removeArticleById,
} = require("../models/articles.model");
const { selectTopics } = require("../models/topics.model");

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
  const { sort_by, order, topic, limit, p } = req.query;
  selectTopics()
    .then((topics) => {
      const validTopics = topics.map((topicObj) => {
        return topicObj.slug;
      });
      selectArticles(sort_by, order, topic, validTopics, limit, p)
        .then((articles) => {
          res.status(200).send({ articles });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;

  updateArticleById(article_id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  selectTopics()
    .then((topics) => {
      const validTopics = topics.map((topicObj) => {
        return topicObj.slug;
      });
      insertArticle(req.body, validTopics)
        .then((article) => {
          res.status(201).send({ article });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticleById(req, res, next) {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getArticles,
  patchArticleById,
  postArticle,
  deleteArticleById,
};

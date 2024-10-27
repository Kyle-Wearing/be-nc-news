const { selectTopics, insertTopic } = require("../models/topics.model");

function getTopics(req, res, next) {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

function postTopic(req, res, next) {
  insertTopic(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, postTopic };

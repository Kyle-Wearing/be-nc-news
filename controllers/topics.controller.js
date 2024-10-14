const { selectTopics } = require("../models/topics.model");

function getTopics(req, res, next) {
  selectTopics().then(({ rows }) => {
    const topics = rows;
    res.status(200).send({ topics });
  });
}

module.exports = { getTopics };

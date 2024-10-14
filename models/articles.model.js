const db = require("../db/connection");

function selectArticleById(id) {
  return db.query(
    `
    SELECT * FROM articles
    WHERE article_id = $1`,
    [id]
  );
}

module.exports = { selectArticleById };

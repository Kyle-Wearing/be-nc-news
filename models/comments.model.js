const db = require("../db/connection");

function selectCommentsByArticleId(id) {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectCommentsByArticleId };

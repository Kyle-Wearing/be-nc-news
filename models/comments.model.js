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

function insertCommentByArticleId(id, newComment) {
  const { username, body } = newComment;
  const queryArray = [body, username, id];
  if (queryArray.includes(undefined)) {
    return Promise.reject({ status: 400, msg: "Invalid comment contents" });
  }
  return db
    .query(
      `
    INSERT INTO comments
    (body, author, article_id, votes)
    VALUES(
    $1,
    $2,
    $3,
    0
    )
    RETURNING *;`,
      queryArray
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function removeCommentById(id) {
  return db.query(
    `
        DELETE FROM comments
        WHERE comment_id = $1`,
    [id]
  );
}

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
};

const db = require("../db/connection");

function selectCommentsByArticleId(id, limit = 10, p = 1) {
  const offset = (p - 1) * limit;
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at
    LIMIT $2 OFFSET $3;`,
      [id, limit, offset]
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
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
    });
}

function updateCommentById(id, { inc_votes }) {
  if (inc_votes && typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid inc_votes type" });
  }
  return db
    .query(
      `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return rows[0];
    });
}

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
};

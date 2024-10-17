const db = require("../db/connection");

function selectArticleById(id) {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
}

function selectArticles(sort_by = "created_at", order = "desc", topic) {
  let queryStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    `;

  const validSortBy = ["article_id", "votes", "title", "created_at", "author"];
  const validOrder = ["desc", "asc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid queries" });
  }
  if (sort_by) {
    queryStr += ` ORDER BY ${sort_by}`;
  }
  if (order) {
    queryStr += ` ${order}`;
  }

  return db.query(queryStr).then(({ rows }) => {
    if (topic) {
      return rows.filter((row) => {
        return row.topic === topic;
      });
    }
    return rows;
  });
}

function updateArticleById(id, { inc_votes }) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
}

module.exports = { selectArticleById, selectArticles, updateArticleById };

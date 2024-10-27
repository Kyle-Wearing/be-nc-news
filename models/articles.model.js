const db = require("../db/connection");

function selectArticleById(id) {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count FROM articles
      LEFT JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
}

function selectArticles(
  sort_by = "created_at",
  order = "desc",
  topic,
  validTopics,
  limit = 10,
  p = 1
) {
  let queryStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    `;

  const validSortBy = ["article_id", "votes", "title", "created_at", "author"];
  const validOrder = ["desc", "asc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid queries" });
  }
  if (!validTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 404, msg: "Topic does not exist" });
  }

  const queryArray = [];
  if (topic) {
    queryStr += ` WHERE articles.topic = $3`;
    queryArray.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by) {
    queryStr += ` ORDER BY ${sort_by}`;
  }
  if (order) {
    queryStr += ` ${order}`;
  }
  const offset = (p - 1) * limit;
  queryArray.unshift(offset);
  queryArray.unshift(limit);
  queryStr += ` LIMIT $1 OFFSET $2`;

  return db.query(queryStr, queryArray).then(({ rows }) => {
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

function insertArticle(newArticle, validTopics) {
  const { author, title, body, topic, article_img_url } = newArticle;
  if (!validTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 404, msg: "Topic does not exist" });
  }
  const values = [author, title, body, topic];
  let queryStr = `INSERT INTO articles
  (author, title, body, topic`;
  if (article_img_url) {
    values.push(article_img_url);
    queryStr += ", article_img_url)";
  } else {
    queryStr += ")";
  }
  queryStr += `VALUES(
  $1,
  $2,
  $3,
  $4
  `;
  if (article_img_url) {
    queryStr += ", $5)";
  } else {
    queryStr += ")";
  }
  queryStr += "RETURNING *;";
  return db.query(queryStr, values).then(({ rows }) => {
    rows[0].comment_count = 0;
    return rows[0];
  });
}

function removeArticleById(id) {
  return db
    .query(
      `
      DELETE FROM articles
      WHERE article_id = $1
      RETURNING *`,
      [id]
    )
    .then(({ rows }) => {
      console.log(rows);
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
    });
}

module.exports = {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
  removeArticleById,
};

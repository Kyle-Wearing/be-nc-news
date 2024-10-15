const db = require("../db/connection");

function selectArticleById(id) {
  return db.query(
    `
    SELECT * FROM articles
    WHERE article_id = $1;`,
    [id]
  );
}

function selectArticles() {
  return db
    .query(
      `
        SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectArticleById, selectArticles };

const db = require("../db/connection");

function selectUsers() {
  return db
    .query(
      `
        SELECT * FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function selectUserByUsername(username) {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE users.username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return rows[0];
    });
}

function insertUser({ username, name, avatar_url }) {
  if (!username || !name) {
    return Promise.reject({ status: 400, msg: "Invalid request body" });
  }
  const queryArr = [username, name];
  let queryStr = `INSERT INTO users
  (username, name`;

  if (avatar_url) {
    queryArr.push(avatar_url);
    queryStr += `, avatar_url`;
  }

  queryStr += `)
  VALUES(
  $1,
  $2`;

  if (avatar_url) {
    queryStr += `,$3`;
  }

  queryStr += ") RETURNING *;";

  return db.query(queryStr, queryArr).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { selectUsers, selectUserByUsername, insertUser };

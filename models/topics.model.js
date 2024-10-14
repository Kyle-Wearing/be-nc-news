const db = require("../db/connection");

function selectTopics() {
  return db.query(`
    SELECT * FROM topics`);
}

module.exports = { selectTopics };

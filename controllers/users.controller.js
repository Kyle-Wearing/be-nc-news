const {
  selectUsers,
  selectUserByUsername,
  insertUser,
} = require("../models/users.model");

function getUsers(req, res, next) {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function postUser(req, res, next) {
  insertUser(req.body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => [next(err)]);
}

module.exports = { getUsers, getUserByUsername, postUser };

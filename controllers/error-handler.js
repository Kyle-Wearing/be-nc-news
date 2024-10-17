function customErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function sqlErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id type" });
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid request body" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "User does not exist" });
  }
}

module.exports = { customErrors, sqlErrors };

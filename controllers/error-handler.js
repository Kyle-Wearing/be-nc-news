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
}

module.exports = { customErrors, sqlErrors };
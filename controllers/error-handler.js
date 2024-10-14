function customErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.ststus(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

module.exports = { customErrors };

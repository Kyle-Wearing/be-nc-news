const endpointsJSON = require("../endpoints.json");

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoints: endpointsJSON });
}

module.exports = getEndpoints;

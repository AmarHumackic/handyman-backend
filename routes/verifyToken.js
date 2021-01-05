var jwt = require('jsonwebtoken');
const {SECRET} = process.env;

const verifyToken = (req, res, next) => {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({error: 'No token provided.'});

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err)
      return res.status(500).send({error: 'Failed to authenticate token.'});

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;

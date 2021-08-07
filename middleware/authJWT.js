const jwt = require("jsonwebtoken");

function createJWT(payload) {
  var result = null;
  jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: '1w' }, function(err, token) {
    if (err) {
      result = null;
    }
    else {
      result = token;
    }
  });
  return result;
}

function verifyJWT(token) {
  var verified = false;
  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    else {
      verified = true;
    }
  });
  return verified;
}

module.exports = { createJWT, verifyJWT };

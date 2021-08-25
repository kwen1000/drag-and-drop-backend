const jwt = require('jsonwebtoken');

function createJWT(res, useremail) {
  jwt.sign(
    { email: userEmail }, 
    process.env.AUTH_SECRET, 
    { expiresIn: '1w' },
    (err, token) => {
      if (err) {
        res.status(401).send({ 
          status: 'error', 
          message: 'Token creation error.' 
        });
      } else {
        res.status(200).send({
          'status': 'success',
          'token': token
        });
      }
    }
  );
}

function verifyJWT(token) {
  var verified = false;
  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return false;
    } else {
      verified = true;
    }
  });
  return verified;
}

module.exports = { createJWT, verifyJWT };

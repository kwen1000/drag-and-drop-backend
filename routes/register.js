var express = require('express');
var validator = require('email-validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var { User } = require('../models');
var { createJWT, verifyJWT } = require('../middleware/authJWT');

var router = express.Router();

const saltRounds = 10;

router.post('/', (req, res, next) => {
  var userEmail = req.body.email;
  var userPass = req.body.password;
  if (!userEmail || !userPass) {
    res.status(401).send({ 
      status: 'error', 
      message: "Email or password missing." 
    });
    return;
  }
  
  /* TO-DO: better validation methods */
  var emailCheck = validator.validate(userEmail);
  var passwordCheck = userPass.length > 3 && userPass.length < 512;

  if (!emailCheck || !passwordCheck) {
    res.status(401).send({ 
      status: 'error', 
      message: 'Invalid email or password.' 
    });
    return;
  }
  
  bcrypt.hash(userPass, saltRounds, (err, hash) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    User.create({
      email: userEmail,
      username: userEmail,
      password: hash
    }).then((item) => {
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
    }).catch((err) => {
      res.status(401).send(err);
    });
  });
});

module.exports = router;

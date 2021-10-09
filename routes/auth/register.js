var express = require('express');
var validator = require('email-validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var { User } = require('../../models');

var router = express.Router();

const saltRounds = 10;

router.post('/', (req, res, next) => {

  var user_email = req.body.email;
  var user_pass = req.body.password;
  
  if (!user_email || !user_pass) {
    res.status(401).send({ 
      status: 'error', 
      message: "Email or password missing." 
    });
    return;
  }
  
  var email_check = validator.validate(user_email);
  var pass_check = user_pass.length > 3 && user_pass.length < 512;

  if (!email_check || !pass_check) {
    res.status(401).send({ 
      status: 'error', 
      message: 'Invalid email or password.' 
    });
    return;
  }
  
  bcrypt.hash(user_pass, saltRounds, (err, hash) => {
  
    if (err) {
      res.status(500).send(err);
      return;
    }

    User.create({
      email: user_email,
      username: user_email,
      password: hash
    }).then(item => {
      jwt.sign(
        { email: user_email }, 
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
    }).catch(err => {
      res.status(401).send(err);
    });
  });
  
});

module.exports = router;

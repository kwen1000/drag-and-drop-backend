const express = require('express');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const router = express.Router();

const SALT_ROUNDS = 10;

router.post('/', (req, res, next) => {

  var user_email = req.body.email;
  var user_pass = req.body.password;
  
  if (!user_email || !user_pass) {
    res.status(401).send({ 
      'message': "Email or password missing." 
    });
    return;
  }
  
  var email_check = validator.validate(user_email);
  var pass_check = user_pass.length > 3 && user_pass.length < 512;

  if (!email_check || !pass_check) {

    res.status(401).send({ 
      'message': 'Invalid email or password.' 
    });

  } else {

    bcrypt.hash(user_pass, SALT_ROUNDS, (err, hash) => {

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
                'message': 'Token creation error.' 
              });
            } else {
              res.status(200).send({
                'token': token
              });
            }

          }
          
        );
      }).catch(err => {
        res.status(401).send(err);
      });
    });
  }
  
});

module.exports = router;

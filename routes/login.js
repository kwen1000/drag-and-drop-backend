var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var { User } = require('../models');

var router = express.Router();

router.post('/', (req, res, next) => {
  var useremail = req.body.email;
  var userpass = req.body.password;
  
  if (!useremail || !userpass) {
    res.status(401).send({ 
      status: 'error', 
      message: "Email or password missing." 
    })
    return;
  }
  
  User.findOne({
    attributes: [ 'password' ],
    where: { email: useremail }
  }).then((item) => {
    if (item == null) {
      res.status(401).send({
        status: 'error',
        message: 'Email not found.'
      });
      return;
    }
    bcrypt.compare(userpass, item.password)
    .then((result) => {
      if (result == true) {
        jwt.sign(
          { email: useremail }, 
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
      } else {
        res.status(401).send({
          status: 'error',
          message: 'Incorrect password.'
        });
      }
    });
  }).catch((err) => {
      res.status(401).send(err);
  });
});

module.exports = router;

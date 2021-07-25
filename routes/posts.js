var express = require('express');
var router = express.Router();

const { User } = require('../models');

router.get('/', (req, res, next) => {
  User.findAll({ 
    attributes: { exclude: ['password'] }
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(500).send(err);
  });
});

module.exports = router;

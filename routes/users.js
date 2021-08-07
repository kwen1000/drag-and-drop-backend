var express = require('express');
var router = express.Router();

const { User } = require('../models').User;

router.get('/', (req, res, next) => {
  if (!req.header('apiKey') || req.header('apiKey') !== process.env.API_KEY) {
    return res.status(401).json({
      status: 'error', message: 'Unauthorized.'
    });
  };
  User.findAll({ 
    attributes: { exclude: ['password'] }
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(500).send(err);
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { User } = require('../../models');

const auth_header = 'Authorization';
const auth_prefix_bearer = 'Bearer';
const auth_prefix_jwt = 'JWT';

router.get('/', (req, res, next) => {

  let header = req.header(auth_header);

  if (!header) {
    return res.status(401).json({
      message: 'Missing auth credentials.'
    });
  }
  
  let header_split = header.split(' ');
  
  if (header !== process.env.AUTH_SECRET) {
    return res.status(401).json({
      message: 'Unauthorized.'
    });
  }
  
  User.findAll({ 
    attributes: { exclude: ['password'] }
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(500).send(err);
  });
  
});

module.exports = router;

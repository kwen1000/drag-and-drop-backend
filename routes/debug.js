var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('debug', { title: 'Express' });
});

module.exports = router;

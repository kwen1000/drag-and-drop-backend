const express = require('express');
var router = express.Router();

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  console.log(id);
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"data": "hello soulwallet! updated!"});
});

module.exports = router;

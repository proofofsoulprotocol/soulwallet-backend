var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"data": "hello soulwallet! updated!"});
});
router.get('/queryGuardianStatus', function(req, res, next) {
  if(req.email){
    res.json({"data": "hello soulwallet! updated!"+ req.email});
  } 
});

module.exports = router;

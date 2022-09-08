var express = require('express');
var router = express.Router();
var apilib = require('../api/apilib');

// APIs for Chrome plugin 
// 1. verifyEmail, input: email, output: random number(6) in mail.
// 2. verifyEmailNum, input: email, random number, output: true or false.
// 3. verifyOwnerMail, input email, output: true or false.
// 4. saveWalletAddress, input: email, wallet_address,[public-key(EOA address)], output: true or false.
// 5. addRecoveryRecord, input: email, wallet_address, output: true or false.
// 6. fetchRecoveryRecords, input: email, output: false or record structure.


router.get('/', function(req, res, next) {
  res.json({"data": "hello soulwallet! updated!"});
});
router.get('/verifyEmail', function(req, res, verifyEmail) {
  // if(req.query.email){
  //   res.json({"data": "hello soulwallet! updated!"+ req.query.email});
  // } 
  // [result, json] = verifyEmail(req);
  // res.json(json);
});


module.exports = router;

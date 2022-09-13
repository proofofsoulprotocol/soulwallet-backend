var express = require('express');
var router = express.Router();
var controller = require('../api/controller');
var config = require('../config');
const { verifyEmail, verifyEmailExists, verifyEmailNum } = require('../api/verify');
const { addRecoveryRecord, fetchRecoveryRecords } = require("../api/recovery-records")
const Account = require('../models/account');

router.get('/', function(req, res, next) {
  res.json({"data": "Hello soulwallet! Welcome to here!"});
});


// post to add
router.post('/add-account', async (req, res) => {
  const account = new Account({
      email: req.body.email,
      wallet_address: req.body.wallet_address
  })
  try {
      const accountToSave = await account.save();
      res.status(200).json(accountToSave)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});


//Get all Method
router.get('/get-all-account', async (req, res, next) => {
  try {
      const data = await Account.find();
      res.json(data)
  }
  catch (error) {
      res.status(500).json({ message: error.message })
  }
});


module.exports = router;

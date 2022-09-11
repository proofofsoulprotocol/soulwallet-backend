var express = require('express');
var router = express.Router();
var controller = require('../api/controller');
var config = require('../config');

const Model = require('../models/model');
const User = require('../models/user');

// APIs for Chrome plugin 
// 1. verify-email, input: email, output: random number(6) in mail.
// 2. verify-email-num, input: email, random number, output: true or false.
// 3. verify-owner-mail, input email, output: true or false.
// 4. save-wallet-address, input: email, wallet_address,[public-key(EOA address)], output: true or false.
// 5. add-recovery-record, input: email, wallet_address, output: true or false.
// 6. fetch-recovery-records, input: email, output: false or record structure.
// 7. add-guardians

router.get('/', function(req, res, next) {
  res.json({"data": "hello soulwallet! updated!"});
});
router.get('/verify-email', controller.verifyEmail);


// Post Method
router.post('/post', async (req, res) => {
  const data = new Model({
      name: req.body.name,
      age: req.body.age
  })

  try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});

// router.post('/addUser', async (req, res) => {
//   const data = new User({
//       email: req.body.email,
//       wallet_address: req.body.wallet_address
//   })
//   try {
//       const dataToSave = await data.save();
//       res.status(200).json(dataToSave)
//   }
//   catch (error) {
//       res.status(400).json({ message: error.message })
//   }
// });


//Get all Method
router.get('/get-all-user', async (req, res, next) => {
  try {
      const data = await User.find();
      res.json(data)
  }
  catch (error) {
      res.status(500).json({ message: error.message })
  }
});


module.exports = router;

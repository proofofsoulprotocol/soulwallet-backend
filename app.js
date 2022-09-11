var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');

var port = process.env.PORT || 3000;
var indexRouter = require('./routes/index');

const main = async () => {
  console.log("mongodb uri now: " + config.mongodbURI);
  await mongoose.connect(config.mongodbURI, config.mongodbConfig);
  console.log("database connected");

  var app = express();
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set('trust proxy', 2);

  app.use('/', indexRouter);
  app.get('/ip', (req, rsp) => rsp.json({ip: req.ip}));

  // error handler
  app.use(function(err, req, res, next) {
    // only providing error in development
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: config.env == 'development' ? err : {}
    });
  });

  var server = http.createServer(app);
  server.listen(port, () => {
    console.log('Express server listening on port ' + port)
  });
};

main();




// APIs for Chrome plugin 
// 1. verifyEmail, input: email, output: random number(6) in mail.
// 2. verifyEmailNum, input: email, random number, output: true or false.
// 3. verifyOwnerMail, input email, output: true or false.
// 4. saveWalletAddress, input: email, wallet_address,[public-key(EOA address)], output: true or false.
// 5. addRecoveryRecord, input: email, wallet_address, output: true or false.
// 6. fetchRecoveryRecords, input: email, output: false or record structure.

// **** response return data structure 
// {   
//   method: triggerRecovery, 
//   code: 200, 
//   status : OK, 
//   params: {data structure},
//   msg: "msgs returned",
//   hash: hash
// }
// or
// {   
//   method: triggerRecovery, 
//   code: 4001, 
//   status : Error, 
//   params: {data structure},
//   msg: "msgs returned",
//   hash: hash
// }
// *******
// recovery record structure
// {
//   email: "aa@aa.com",
//   wallet_address: "lajsdf09rp23092-3jsdksdf",
//   recovery_records: [
//       {
//           guardian_address: "asdfadf23234233",
//           sign_status: true
//       },
//       {
//           guardian_address: "sdfk8878dglkdg0g",
//           sign_status: false
//       },
//       {
//           guardian_address: "ksjdlfj0808092834g",
//           sign_status: false
//       }
//   ]
// }
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');
var indexRouter = require('./routes/index');
const Account = require('./models/account');
const Verification = require('./models/verification');
const RecoveryRecord = require('./models/recovery-record');
const { verifyEmail, verifyEmailExists, verifyEmailNum } = require('./api/verify');
const { addRecoveryRecord, fetchRecoveryRecords } = require("./api/recovery-records")
const {addAccount, updateAccount, isWalletOwner, addAccountGuardian, getAccountGuardian, updateAccountGuardian} = require('./api/account');
const {addGuardianSetting, updateGuardianSetting} = require('./api/guardian-setting');
const GuardianSetting = require('./models/guardian-setting');
var port = process.env.PORT || 3000;

const main = async () => {
  console.log("mongodb uri now: " + config.mongodbURI);
  await mongoose.connect(config.mongodbURI, config.mongodbConfig);
  await Account.ensureIndexes();
  await Verification.ensureIndexes();
  await RecoveryRecord.ensureIndexes();
  await GuardianSetting.ensureIndexes();
  console.log("database connected");

  var app = express();
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set('trust proxy', 2);

  // verify
  app.post('/verify-email', verifyEmail);
  app.post('/verify-email-num', verifyEmailNum);
  app.post('/verify-email-exists', verifyEmailExists);

  // acount
  app.post('/add-account', addAccount);
  app.post('/is-owner', isWalletOwner);
  app.post('/update-account', updateAccount); //update account's wallet_address and guardians
  // acount guardian
  app.post('/add-account-guardian', addAccountGuardian); // add new one, unique
  app.post('/get-account-guardian', getAccountGuardian); // get a array obj
  app.post('/update-account-guardian', updateAccountGuardian);// replace old one with new

  // guardian-setting
  app.post('/add-guardian-setting',addGuardianSetting);
  app.post('/update-guardian-setting',updateGuardianSetting);

  // recovery record
  app.post('/add-recovery-record', addRecoveryRecord);
  app.post('/fetch-recovery-records', fetchRecoveryRecords);

  app.get('/ip', (req, rsp) => rsp.json({ip: req.ip}));
  app.use('/', indexRouter);
  console.log("ENV:",process.env.MONGODB_URI)
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
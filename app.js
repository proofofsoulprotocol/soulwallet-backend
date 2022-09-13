var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');
var indexRouter = require('./routes/index');
const { verifyEmail, verifyEmailExists, verifyEmailNum } = require('./api/verify');
const Account = require('./models/account');
const Verification = require('./models/verification');

var port = process.env.PORT || 3000;

const main = async () => {
  console.log("mongodb uri now: " + config.mongodbURI);
  await mongoose.connect(config.mongodbURI, config.mongodbConfig);
  Account.ensureIndexes();
  Verification.ensureIndexes();
  console.log("database connected");

  var app = express();
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set('trust proxy', 2);

  app.post('/verify-email', verifyEmail);
  app.post('/verify-email-num', verifyEmailNum);
  app.post('/verify-email-exists', verifyEmailExists);
  app.get('/ip', (req, rsp) => rsp.json({ip: req.ip}));
  app.use('/', indexRouter);

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
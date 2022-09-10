var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var config = require('./config');

var port = process.env.PORT || 3000;
var indexRouter = require('./routes/index');

// console.log(config.mongodb);
// mongoose.connect(config.mongodb);
mongoose.connect('mongodb://localhost/soulwallet');
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
});
database.once('connected', () => {
    console.log('Database Connected');
});


var app = express();

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



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({});
});

var server = http.createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + port)
})
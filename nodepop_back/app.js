var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// require database connection
require('./lib/dbConnect');

// require models
require('./models/Ad');

var app = express();

// app setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app general middlwares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// web app middlewares
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// nodepop_back middlewares
app.use('/apiv1/nodepop', require('./routes/apiv1/ads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (err.array) {
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // error response if is and API request with JSON format
  if ( isAPI(req) ) {
    res.json({
      success: false,
      error: err.message
    });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.render('error');
});

// isAPI request validation function
function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;

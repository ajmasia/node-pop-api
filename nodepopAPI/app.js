'use strict';

// Require dependences
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appLib = require('./lib/appLib');

// Require database connection
require('./lib/dbConnect');

// Require models
require('./models/Ad');

var app = express();

// App setup
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static documents middleware
app.use(express.static(path.join(__dirname, 'public')));

// Web app middlewares
app.use('/', require('./routes/index'));

// Nodeapi middlewares
app.use('/apiv1', require('./routes/apiv1/ads'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {

  if (err.array) {
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // Error response if is and API request with JSON format
  if ( appLib.isAPI(req) ) {
    res.json({
      success: false,
      error: err.message
    });
    return;
  }

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Render the error page
  res.render('error');
});

module.exports = app;

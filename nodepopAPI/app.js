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
const dbConnect = require('./lib/dbConnect');

// Require models
require('./models/Ad');
require('./models/User');

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

// Requiren controllers
const usersController = require('./controllers/apiv1/userController');

/**
 * API middelwares
 */
app.get('/apiv1/users', usersController.usersList);
app.post('/apiv1/singup', usersController.singUp);
app.delete('/apiv1/users/:id', usersController.deleteUser);
app.put('/apiv1/users/:id', usersController.updateUser);
app.post('/apiv1/login', usersController.singIn);
app.use('/apiv1/ads', require('./routes/apiv1/ads'));

/**
 * Weba app middelwares
 */
app.use('/', require('./routes/index'));

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

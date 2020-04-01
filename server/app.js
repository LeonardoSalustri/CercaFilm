var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assert=require("assert");
var db_ops=require("../mongodb/db_operations.js");
var body_parser=require("body-parser");
var mongoose = require("mongoose");
var usermodel = require("./schemas/users");
var film = require("./schemas/film");

var app = express();
const wss=require("express-ws")(app);


var indexRouter = require('./routes/index');
var findRouter = require("./routes/find");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());


app.use('/', indexRouter);
//app.use("/find", findRouter);


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
 // res.render('error');
});
app.listen(3000,()=>{
  console.log("Listening...");
});

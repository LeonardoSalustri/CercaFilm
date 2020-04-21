var createError = require('http-errors');
var express = require('express');
var http=require("http");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assert=require("assert");
var db_ops=require("../mongodb/db_operations.js");
var body_parser=require("body-parser");
var mongoose = require("mongoose");
var usermodel = require("./schemas/user");
var film = require("./schemas/film");
var session = require("express-session");
var file_store = require("session-file-store")(session);
var passport = require("passport");

mongoose.set("useCreateIndex",true);
mongoose.connect("mongodb://localhost:27017/cercafilm");

var app = express();
var server = http.createServer(app);
const wss=require("express-ws")(app,server);

app.use(session({
  name: "session-id",
  secret: "12345678987654321",
  saveUninitialized: false,
  resave: false,
  store: new file_store()
}));

app.use(passport.initialize());
app.use(passport.session());


var authRouter = require('./routes/auth');
var findRouter = require("./routes/find");
var profileRouter = require("./routes/profile");
var homeRouter = require("./routes/home");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());


app.use('/auth', authRouter);

app.use("/",homeRouter);

app.use("/users",profileRouter);
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
  res.end(err.message);

});
server.listen(3000,()=>{
  console.log("Listening...");
});
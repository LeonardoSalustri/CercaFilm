var createError = require('http-errors');
var express = require('express');
var http=require("http");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assert=require("assert");
var body_parser=require("body-parser");
var mongoose = require("mongoose");
var usermodel = require("./schemas/user");
var film = require("./schemas/film");
var passport = require("passport");
var https = require("https");
var fs = require("fs");
var config = require("./config.js");
var authentication = require("./routes/auth_jwt");
var users = require("./schemas/user");

mongoose.set("useCreateIndex",true);
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
mongoose.connect(config.mongoUrl);

var app = express();
var server = http.createServer(app);

var options={
  key:fs.readFileSync(__dirname+"/private.key"),
  cert:fs.readFileSync(__dirname+"/certificate.pem")
};

var secServer = https.createServer(options,app);

const wss=require("express-ws")(app,secServer);

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.secret_key));
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());


app.use(passport.initialize());


var authRouter = require('./routes/auth');
var profileRouter = require("./routes/profile");
var homeRouter = require("./routes/home");
var findRouter = require("./routes/find");





app.use('/auth', authRouter);

app.use("/",homeRouter);
app.use("/find",findRouter);

app.use("/user",profileRouter);
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
  fs.readFile(path.resolve(__dirname + '/public/html/error.html'), 'utf8', function(errore, html){
    var result = html+"<div style='margin-top:110px;margin-left:30px'>"+
    "<h2>ERRORE</h2><p>"+err.message+"</p></div>"+
    "<script src = '../javascripts/bootstrap/min.js'></script></body></html>"
    res.end(result);
  });
});
//server.listen(3000,()=>{
 // console.log("Listening...");
//});
//app.set("port",3000);


module.exports = {
  app:app,
  server:server,
  secServer:secServer
};
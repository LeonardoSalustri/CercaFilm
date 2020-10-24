var express = require('express');
var router_auth = express.Router();
var path = require("path");
var www=require("../bin/www");
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var passport = require("passport");
var authentication = require("./auth_jwt");
var config = require("../config");



router_auth.route("/registration")
.get((req,res,next)=>{
  if(!req.signedCookies.token){
    res.statusCode=200;
    res.setHeader("Content-Type","text/html");
    res.sendFile(path.resolve(__dirname+"/../public/html/registration.html"));
  }
  else{
    var err = new Error("Devi prima fare il logout");
    err.status=403;
    next(err);
  }
})
.post((req,res,next)=>{
  users.register(new users({username:req.body.username,email:req.body.email}),req.body.password,(err,user)=>{
    res.setHeader("Content-Type","application/json");
    if(err){
      res.statusCode=500;
      res.json({err:err});
    }
    else{
      res.statusCode=200;
      res.setHeader("Content-Type","application/json");
      res.json({message:"you are registered"});
    }
  })
});
router_auth.route("/login")
.get((req,res,next)=>{
  if(!req.signedCookies.token){
    res.statusCode=200;
    res.setHeader("Content-Type","text/html");
    res.sendFile(path.resolve(__dirname+"/../public/html/login.html"));
  }
  else{
    var err = new Error("Sei gia loggato");
    err.status = 403;
    next(err);
  }
})
.post(passport.authenticate("local"),(req,res)=>{
  console.log(req.ip.split(":"));
  var token = authentication.getToken({_id:req.user._id,ip:req.ip.split(":")[3]});
  var options = {
    maxAge:3600000,
    signed:true
  };
  res.statusCode=200;
  res.setHeader("Content-Type","application/json");
  res.cookie("token",token,options);
  res.json({success:true,message:"you are logged in "+"cookie: "+token});

});
router_auth.route("/logout")
.get((req,res,next)=>{
  if(!req.signedCookies.token){
    var err = new Error("You are not logged in");
    res.statusCode=500;
    res.setHeader("Content-Type","application/json");
    res.json({err:err});
  }
  else{
      res.clearCookie("token");
      res.redirect("/auth/login");
  }
});

router_auth.ws("/ws",(ws,req)=>{
  ws.on("message",(msg)=>{
    users.findOne({username:msg})
    .then((user)=>{
      if(user!==null){
        ws.send("esiste");
      }
      else{
        ws.send("ok");
      }
    })
    .catch((err)=>{
      next(err);
    });
  });
});

module.exports = router_auth;

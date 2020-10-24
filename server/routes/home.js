var express = require('express');
var router_home = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var films = require("../schemas/film");
var path=require("path");
var find = require("./find");

router_home.route("/")
.get((req,res,next)=>{
    res.setHeader("Conent-Type","text/html");
    res.statusCode=200;
    res.sendFile(path.resolve("./public/html/home.html"));
});


module.exports=router_home;
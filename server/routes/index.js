var express = require('express');
var router = express.Router();
var path = require("path");
var mongodb=require("mongodb").MongoClient;
var db_ops=require("../../mongodb/db_operations.js");

/* GET home page. */
router.route("/")
.get((req,res,next)=>{
  res.statusCode=200;
  res.setHeader("Content-Type","text/html");
  res.sendFile(path.resolve(__dirname+"/../public/html/index.html"));
});

module.exports = router;

var express = require('express');
var router = express.Router();
var path = require("path");
var db_ops=require("../../mongodb/db_operations.js");
var www=require("../bin/www");
var mongodb=require("mongodb").MongoClient;
var assert=require("assert");

/* GET home page. */
router.route("/")
.get((req,res,next)=>{
  res.statusCode=200;
  res.setHeader("Content-Type","text/html");
  res.sendFile(path.resolve(__dirname+"/../public/html/index.html"));
});
router.route("/registration")
.get((req,res,next)=>{
  res.statusCode=200;
  res.setHeader("Content-Type","text/html");
  res.sendFile(path.resolve(__dirname+"/../public/html/index.html"));
})
.post((req,res,next)=>{
  res.send("ESKERE");
});

router.ws("/ws",(ws,req)=>{
  ws.on("message",(msg)=>{
    mongodb.connect("mongodb://localhost:27017/",(err,client)=>{
      assert.equal(err,null);
      var db=client.db("cercafilm");
      var collection= db.collection("users");
      return collection.find({"username":msg}).toArray()
    .then((result)=>{
      console.log(result);
      if(result!=null){
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
});

module.exports = router;

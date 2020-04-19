var express = require('express');
var router_home = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var films = require("../schemas/film");
var path=require("path");

router_home.route("/")
.get((req,res,next)=>{
    res.setHeader("Conent-Type","text/html");
    res.statusCode=200;
    res.sendFile(path.resolve("./public/html/home.html"));
    res.end();
});

router_home.ws("/ws",(ws,req)=>{
    var username = req.user.username;
    ws.on("message",(msg)=>{
        console.log(msg);
        var messaggio = msg.split("/");
        var film = messaggio[0];
        var voto = messaggio[1];
        users.findOneAndUpdate({username:username},{"$push":{film_valutati:{titolo:film,rating:voto}}})
        .then((result)=>{
            console.log("Updated");
            ws.send("ok");
        })
        .catch((err)=>{
            console.log(err);
            ws.send("errore");//ricaricare la pagina lato client
        });
    });
});

module.exports=router_home;
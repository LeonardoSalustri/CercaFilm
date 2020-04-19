var express = require('express');
var router_profile = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var films = require("../schemas/film");
var path = require("path");

router_profile.route("/profile")
.get((req,res,next)=>{
    res.statusCode=200;
    res.setHeader("Content-Type","text/html");
    res.sendFile(path.resolve("./public/html/profile.html"));
});

router_profile.ws("/profile/ws",(ws,req)=>{
    ws.on("message",(msg)=>{
        if(msg==="get_info"){
            users.findOne({username:req.user.username})
            .then((user)=>{
                var content = {"username":user.username,"e-mail":user.email,"film_valutati":user.film_valutati,"generi":user.generi,"film_visti":user.film_visti};
                ws.send(JSON.stringify(content));
            })
            .catch((err)=>{
                console.log(err);
            });
         }
         else{
            console.log(msg);
            films.find({"$text":{
                "$search":msg
            }})
            .then((result)=>{
                console.log(result);
                array=[];
                for(var i = 0;i<result.length;i++){
                    array.push({
                        "titolo":result[i].titolo,"anno":result[i].anno,"durata":result[i].durata,"genere":result[i].genere,
                        "registi":result[i].registi,"attori":result[i].attori,"autori":result[i].autori,"sceneggiatori":result[i].sceneggiatori,
                        "rating":result[i].rating,"rating esterno":result[i].rating_esterno,"votanti":result[i].votanti,
                        "trama":result[i].trama
                    });
                    
                }
                var content = {
                    "results":result.length,
                    "content":array
                };
                ws.send(JSON.stringify(content));
                })
            .catch((err)=>{
                    console.log(err);
                });
        
         }
    });
});


module.exports=router_profile;
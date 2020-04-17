var express = require('express');
var router_profile = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var films = require("../schemas/film");
var path = require("path");


connection = mongoose.connect("mongodb://localhost:27017/cercafilm");


router_profile.route("/profile")
.get((req,res,next)=>{
    res.setHeader("Content-Type","text/html");
    res.statusCode=200;
    res.sendFile(path.resolve("./public/html/profile.html"));
});

router_profile.ws("/profile/ws",(ws,req)=>{
    ws.on("message",(msg)=>{
        if(msg === "get_film"){
            ws.on("message",(msg1)=>{
                console.log(msg1);
                films.find({titolo:msg1})
                .then((result)=>{
                    console.log(result);
                    array=[];
                    for(var i = 0;i<result.length;i++){
                        array[i]={
                            "titolo":result[i].titolo,"anno":result[i].anno,"durata":result[i].durata,"genere":result[i].genere,
                            "regista":result[i].regista,"attori":result[i].attori,"rating":result[i].rating,"rating esterno":result[i].rating_esterno,"votanti":result[i].votanti,
                            "trama":result[i].trama
                        };
                        
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
            });
            
         }
         else if(msg==="get_info"){
            users.findOne({username:req.user.username})
            .then((user)=>{
                var content = {"username":user.username,"e-mail":user.email,"film_valutati":user.film_valutati,"generi":user.generi,"film_visti":user.film_visti};
                ws.send(JSON.stringify(content));
            })
            .catch((err)=>{
                console.log(err);
            });
         }
    });
});


module.exports=router_profile;
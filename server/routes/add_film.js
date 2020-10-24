var express = require('express');
var router_add = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var path = require("path");
var authentication=require("./auth_jwt");
var passport = require("passport");
var jwt_decode = require("jwt-decode");
var jwt = require("jsonwebtoken");
var config = require("../config");


router_add.ws("/user/add_film",(ws,req)=>{
    console.log("arrivata richiesta");
    var decoded = jwt.verify(req.signedCookies.token,config.secret_key);
    var id = decoded._id;
    ws.on("message",(msg)=>{
        console.log(msg);
        var array = msg.split("/");
        var action = array[0];
        var identificativo = array[1];
        var titolo = array[2];
        var voto = array[3];
        users.findOne({_id:id})
        .then((result)=>{
            var array = result.film_valutati;
            var esistenza = esiste(titolo,array)
            .then((exist)=>{
                if(exist){
                    if(action === "elimina"){
                        users.updateOne({_id:id},{$pull:{film_valutati:{id:identificativo}}})
                        .then((ris)=>{
                            films.findOne({_id:identificativo})
                            .then((doc)=>{
                                /*changing the rating*/
                                doc.save()
                                .then((doc)=>{
                                    ws.send("eliminato");
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    ws.send("error");
                                });
                            })
                            .catch((err)=>{
                                console.log(err);
                                ws.send("error");
                            });
                        })
                        .catch((err)=>{
                            console.log(err);
                            ws.send("error");
                        });
                    }
                    else{
                        ws.send("esiste");
                    }
                }
                else{      
                    if(action==="aggiungi"){           
                        users.updateOne({_id:result._id},{"$push":{film_valutati:{id:identificativo,titolo:titolo,rating:parseInt(voto)}}})
                        .then((doc)=>{
                            films.findOne({_id:identificativo})
                            .then((doc)=>{
                                /*changing the rating*/
                                doc.save()
                                .then((doc)=>{
                                    ws.send("ok");
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    ws.send("error");
                                });
                            })
                        .catch((err)=>{
                            console.log(err);
                            ws.send("error");
                        });
                        });
                    }
                    else{
                        console.log("eliminazioneimpossibile");
                        ws.send("eliminazionenonpossibile");
                    }
                }
            })      
        })
        .catch((err)=>{
            ws.send("error");
            console.log(err);
            });
        });
    });
var express = require('express');
var router_profile = express.Router();
var mongoose = require("mongoose");
var assert=require("assert");
var users = require("../schemas/user");
var films = require("../schemas/film");
var path = require("path");
var authentication=require("./auth_jwt");
var passport = require("passport");
var jwt_decode = require("jwt-decode");
var jwt = require("jsonwebtoken");

function esiste(elem,array){
    return new Promise(function(resolve,reject){
        var result = false;
        for (var i = 0;i<array.length;i++){
            if(elem===array[i]._id){
                result = true;
                break;
            }
        }
        resolve(result);
    })

}

function getVoto(elem,array){
    return new Promise(function(resolve,reject){
        for (var i = 0;i<array.length;i++){
            if(array[i]._id === elem)
                resolve(array[i].voto)
        }
        reject(undefined);
    });
}
router_profile.route("/")
.get((req,res,next)=>{
    var auth = authentication.auth(req).
    then((struct)=>{
        if(!struct.err){
            console.log(struct);
            res.statusCode=200;
            res.setHeader("Content-Type","text/html");
            res.sendFile(path.resolve(__dirname+"/../public/html/profile.html"));
        }
        else{
            res.clearCookie("token");
            res.redirect("/auth/login");
            }
        })
    .catch((struct)=>{
        if(struct.redirect === null){
            res.redirect("/users/profile");
        }
        else{
            res.redirect("/auth/login");
        }
        });
});




/*da rivedere*/
router_profile.ws("/profile",(ws,req)=>{
    var id = jwt_decode(req.signedCookies.token)._id;
    ws.on("message",(msg)=>{
        if(msg==="get_info"){
            users.findOne({_id:id})
            .populate("film_valutati._id",["titolo","img"])
            .then((user)=>{
                var content = {"username":user.username,"email":user.email,"film_valutati":user.film_valutati,"generi":user.generi,"film_visti":user.film_visti};
                ws.send(JSON.stringify(content));
            })
            .catch((err)=>{
                console.log(err);
            });
         }
     });
});

router_profile.ws("/add_film",(ws,req)=>{
    console.log("Arrivata");
    console.log(req.signedCookies.token);
    var auth = authentication.auth(req).
    then((struct)=>{
        if(!struct.err){
            var id = jwt_decode(req.signedCookies.token);
            ws.on("message",(msg)=>{
                console.log(msg);
                var array = msg.split("/");
                var action = array[0];
                var identificativo = parseInt(array[1]);
                var titolo = array[2];
                var voto = array[3];
                users.findOne({_id:id})
                .then((result)=>{
                    var array = result.film_valutati;
                    console.log(array);
                    var esistenza = esiste(identificativo,array)
                    .then((exist)=>{
                        if(exist){
                            if(action === "elimina"){
                                users.findOneAndUpdate({_id:id},{"$pull":{film_valutati:{_id:identificativo}}})
                                .then((ris)=>{
                                    console.log("prima di getvoto");
                                    var toglivoto = getVoto(identificativo,ris.film_valutati)
                                    .then((voto1)=>{
                                        console.log("getVoto: "+voto1);
                                        films.findOne({_id:identificativo})
                                        .then((doc)=>{
                                            if(doc.rating_interno.votanti===1){
                                                console.log("Un solo votante");
                                                doc.rating_interno.rating=doc.rating_interno.rating-voto1;
                                                doc.rating_interno.votanti = 0;
                                            }
                                            else{
                                            doc.rating_interno.rating = ((doc.rating_interno.rating*doc.rating_interno.votanti)-voto1)/(doc.rating_interno.votanti-1);
                                            doc.rating_interno.votanti = doc.rating_interno.votanti-1;
                                            }
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
                                    .catch(()=>{
                                        console.log(err);
                                        ws.send("error");
                                    })
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
                                users.updateOne({_id:result._id},{"$push":{film_valutati:{_id:identificativo,voto:parseInt(voto)}}})
                                .then((doc)=>{
                                    films.findOne({_id:identificativo})
                                    .then((doc)=>{
                                        console.log(doc.rating_interno.rating+"*"+doc.rating_interno.votanti+"+"+voto+"/"+doc.rating_interno.votanti+"+1");
                                        doc.rating_interno.rating = (((doc.rating_interno.rating)*(doc.rating_interno.votanti))+voto)/(doc.rating_interno.votanti+1);
                                        doc.rating_interno.votanti = doc.rating_interno.votanti+1;
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
        }
        else{
            res.clearCookie("token");
            res.redirect("/auth/login");
            }
        })
    .catch((struct)=>{
        if(struct.redirect === null){
            res.redirect("/users/profile");
        }
        else{
            res.redirect("/auth/login");
        }
        });
    
    });


module.exports=router_profile;
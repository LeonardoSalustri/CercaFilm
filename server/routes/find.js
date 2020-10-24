var express = require("express");
var mongoose = require("mongoose");
var router_find = express.Router();
var users = require("../schemas/user");
var films = require("../schemas/film");
var registi = require("../schemas/regista");
var attori = require("../schemas/attore");
var sceneggiatori = require("../schemas/sceneggiatore");
var autori = require("../schemas/autore");
var keywords = require("../schemas/keyword");
var generi = require("../schemas/genere");
var path = require("path");
var request = require("request");
var syncreq = require("sync-request");
var config= require("../config");


function clean_title(txt){
    return new Promise(function(resolve,reject){
        var title = txt.toLowerCase();
        var array = title.split(new RegExp(config.delimiters,"g"));
        var testo = "";
        for (var i = 0;i<array.length;i++){
            if(!config.esclusi.includes(array[i])&&(array[i]!=="" || array[i]!==" ")){
                testo=testo+array[i]+" ";
            }
        }
        if(testo){
            testo = testo.replace(new RegExp(" +","g")," ");
            resolve(testo);
        }
        else{
            reject(new Error("Il titolo non è ben formato"));
        }
    })
}

function sync_req (url){
    return new Promise(function(resolve,reject){
        request(url,{json:true},(err,res,body)=>{
            if(err){
                reject(err);
            }
            resolve(body);
        })
    });
}
router_find.route("/personalizzata")
.get((req,res,next)=>{
    res.statusCode=200;
    res.sendFile(path.resolve(__dirname+"/../public/html/ricerca.html"));
})
.post((req,res,next)=>{
    console.log(JSON.stringify(req.body));
    var ricerca = req.body.ricerca;
    if(req.body.lingua ==="italiano"){
        var lingua = "it-IT";
    }
    else{
        var lingua = "en-EN";
    }
    var query = ricerca.split(" ");
    ricerca = "";
    for (var i = 0;i<query.length;i++){
        ricerca+=query[i]+"%20";
    }
    var anno = req.body.anno;
    var url = "https://api.themoviedb.org/3/search/movie?api_key="+config.api_key+"&query="+ricerca+"&language="+lingua+"&year="+anno;
    request(url, { json: true }, (err, res1, body) => {
        if (err) { return console.log(err); }
        console.log(body);
        res.json({result:body})
    });



    
});


router_find.ws("/ws",(webs,req)=>{
    webs.on("message",(msg)=>{
        var testo = clean_title(msg)
        .then((testo)=>{
            console.log(testo);
            films.find({"$text":{
                "$search":'\"'+testo+'\"'
            }})
            .populate("attori")
            .populate("registi")
            .populate("sceneggiatori")
            .populate("genere")
            .populate("autori")
            .then((result)=>{
                var array=[];
                if(result.length!==0){
                    console.log(result);
                    for(var i = 0;i<result.length;i++){
                        console.log(result);
                        array.push({
                            "id":result[i]._id,"img":result[i].img,"titolo":result[i].titolo,"anno":result[i].anno,"durata":result[i].durata,"genere":result[i].genere,
                            "registi":result[i].registi,"attori":result[i].attori,"produzione":JSON.stringify(result[i].produzione)
                        });
                        var content = {
                            "results":array.length,
                            "content":array
                        };
                        webs.send(JSON.stringify(content));
                        
                    }
                }
                else if(result.length===0){
                    films.find({"$text":{
                        "$search":testo
                    }})
                    .populate("attori")
                    .populate("registi")
                    .populate("sceneggiatori")
                    .populate("genere")
                    .populate("autori")
                    .then((result1)=>{

                        var new_array=[];
                        if(result1===null){
                            console.log("Nessun film trovato");
                            webs.send("not_found");
                        }
                        else{
                            console.log(result1);
                        for(var j = 0;j<result1.length;j++){
                            new_array.push({
                                "id":result1[j]._id,"img":result1[j].img,"titolo":result1[j].titolo,"anno":result1[j].anno,"durata":result1[j].durata,"genere":result1[j].genere,
                                "registi":result1[j].registi,"attori":result1[j].attori,"produzione":JSON.stringify(result1[j].produzione)
                            });
                            
                        }
                        var content = {
                            "results":new_array.length,
                            "content":new_array
                        };
                        webs.send(JSON.stringify(content));
                    }
                    })
                    .catch((err)=>{
                        console.log("Errore nella query del database: " + err);
                        webs.send("error");
                    });
                }
            })
            .catch((err)=>{
                webs.send("error");
                console.log(err);
                });
        })
        .catch((err)=>{
            console.log("Errore nella query del database: " + err);
            webs.send("error");
        }) 
    })
});

module.exports=router_find;
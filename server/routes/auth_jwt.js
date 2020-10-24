var jwtstrategy = require("passport-jwt").Strategy;
var localStrategy = require("passport-local").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var passport = require("passport");
var config = require("../config");
var users = require("../schemas/user");
var jwt_decode = require("jwt-decode");
var crypto = require("crypto");
var base64 = require("base64url");

exports.local = passport.use("local",new localStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

exports.extractor = (req)=> {
    return new Promise(function(resolve,reject){
        var token = null;
        if (req && req.signedCookies && req.signedCookies.token){
            console.log(req.signedCookies.token);
            const token=req.signedCookies.token;
            var array = token.split(".");
            var header = base64.decode(array[0]);
            var payload = base64.decode(array[1]);
            var sign = base64.decode(array[2]);
            console.log(header+"\n"+payload+"\n"+sign);
            var decoded = jwt.verify(token,config.secret_key);
            console.log(decoded);
            if(decoded){
                resolve(decoded);
            }
            else{
                reject(err);
            }
        }
        else{
            reject(new Error("No token in cookies"));
        }
    });
};
exports.esiste = (token)=>{
    return new Promise(function(resolve,reject){
        users.findOne({_id:token._id})
        .then((user)=>{
            if(user){

                resolve(true);
            }
            else{

                resolve(false);

            }
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

exports.auth=(req)=>{
    return new Promise((resolve,reject)=>{
        var struct={};
        this.extractor(req)
        .then((token)=>{
            this.esiste(token)
            .then((result)=>{
                if(result){
                    struct.err=false;
                    struct.cookie=false;
                    struct.redirect = null;
                }
                else{
                    struct.err=true;
                    struct.cookie=true;
                    struct.redirect = "auth/login";

                }
                resolve(struct);
            })
            .catch((err)=>{
                var struct = {err:true,
                redirect:null,
                cookie:false};
                reject(struct);
            })
        })
        .catch((err)=>{
            var struct = {err:true,
                redirect:"/auth/login",
                cookie:false};
            console.log(struct);
            reject(struct);
            
        })
    });
}


exports.getToken=(user)=>{
    console.log("I'm using "+config.secret_key+" to sign the cookie, payload: "+JSON.stringify(user));
    return jwt.sign(user,config.secret_key,{expiresIn:"3600000"});
};


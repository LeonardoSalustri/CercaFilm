var mongoose = require("mongoose");
var schema = mongoose.Schema;
var films=require("./film");
var passport = require("passport");
var passport_local_mongoose = require("passport-local-mongoose")

var genere_utente_schema = new schema(
    {
        genere:{
            type:[{type:schema.Types.Number,ref:"generis"}],
            default:[]
        },
        preferenza:{
            type:Number,
            min:0,
            max:100,
            default:0
        }
    });

module.exports = mongoose.model("genere_utenti",genere_utente_schema);
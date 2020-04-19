var mongoose = require("mongoose");
var schema = mongoose.Schema;
var films=require("./film");
var film_valutati = require("./film_valutati")
var passport = require("passport");
var passport_local_mongoose = require("passport-local-mongoose")

var userschema = new schema(
    {
      email:{
        type: String,
        required:true,
        unique: true
      },
      generi:[{type:String,default:[]}],
      film_valutati: [{type:schema.Types.Mixed,ref:"film_valutati",default:[]}]
    },{
    timestamps: true
    }
  );
  userschema.plugin(passport_local_mongoose);
  module.exports = mongoose.model("user",userschema);
var mongoose = require("mongoose");
var schema = mongoose.Schema;
var films=require("./film");
var passport = require("passport");
var passport_local_mongoose = require("passport-local-mongoose")

var film_valutati_schema = new schema(
  {
    _id:{
      type: Number,
      ref:"films",
    },
    voto:{
      type:Number
    }
  }
);
var keywords_valutate_schema = new schema(
  {
    _id:{
      type: Number,
      ref:"keywords",
    },
    voto:{
      type:Number
    }
  }
);

var userschema = new schema(
    {
      email:{
        type: String,
        required:true,
        unique: true
      },
      generi:{
        type:[schema.Types.Mixed],
        ref:"genere_utentis",
        default:[]
      },
      film_valutati:{
        type:[{
          _id:{
            type: Number,
            ref:"film",
          },
          voto:{
            type:Number
          }
        }],
        default:[]
      },
      keywords:{
        type:[keywords_valutate_schema],
        default:[]
      }
    },{
    timestamps: true
    }
  );


  userschema.plugin(passport_local_mongoose);
  module.exports = mongoose.model("user",userschema);
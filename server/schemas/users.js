var mongoose = require("mongoose");
var schema = mongoose.Schema;
var films=require("./film");

var film_schema=new schema({
  titolo:{
      type:String,
      required:true,
  },
  anno:{
      type:String,
      required:true,
  },
  durata:{
      type:String,
      required:true,
  },
  genere:{
      type:[String],
      required:true,
  },
  regista:{
      type:String,
      required:true,
  },
  attori:{
      type:[String],
      required:true,
  },
  rating:{
      type:Number,
      min:1,
      max:5
  },
  votanti:{
      type:Number,
      required:true,
      default:0
  },
  img: String
})

var film_visti_schema=new schema({
  titolo:{
      type:String,
      required:true,
  },
  anno:{
      type:String,
      required:true,
  }
})

var film_valutati_schema=new schema({
  titolo:{
      type:String,
      required:true,
  },
  anno:{
      type:String,
      required:true,
  },
  genere:{
      type:[String],
      required:true,
  },
  regista:{
      type:String,
      required:true,
  },
  attori:{
      type:[String],
      required:true,
  },
  rating:{
      type:Number,
      min:1,
      max:5,
      required:true
  }
})

var userschema = new schema(
    {
      nome: {
        type: String,
        required:true
      },
      username:{
        type: String,
        required:true,
        unique: true
      },
      email:{
        type: String,
        required:true,
        unique: true
      },
      password:{
        type: String,
        required:true
      },
      generi:[String],
      film_visti: [ film_visti_schema ],
      film_valutati: [ film_valutati_schema ]
    },{
    timestamps: true
    }
  );
  var users = mongoose.model("user",userschema);

  module.exports=users;
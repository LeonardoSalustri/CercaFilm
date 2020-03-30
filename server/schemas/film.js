var mongoose = require("mongoose");
var schema = mongoose.Schema;

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

var film=mongoose.model("film",film_schema);
var film_visti=mongoose.model("film_visti",film_visti_schema);
var film_valutati=mongoose.model("film_valutati",film_valutati_schema);

module.exports = film;
module.exports=film_visti;
module.exports=film_valutati;
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
    rating_esterno:{
        type:Number,
        min:0,
        max:100,
        default:0
    },
    rating:{
        type:Number,
        min:0,
        max:100,
        default:0
    },
    votanti:{
        type:Number,
        required:true,
        default:0
    },
    img: String,
    trama:{
        type:String,
        default:""
    }
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


module.exports = mongoose.model("film",film_schema);
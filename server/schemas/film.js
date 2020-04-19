var mongoose = require("mongoose");
var schema = mongoose.Schema;
var attori = require("./attore.js");

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
    produzione:{
        type:String,
        default:""
    },
    genere:{
        type:[String],
        required:true,
    },
    registi:{
        type:[schema.Types.Mixed],
        ref:"registi",
        required:true,
    },
    sceneggiatori:{
        type:[schema.Types.Mixed],
        ref:"sceneggiatori",
        default:[]
    },
    autori:{
        type:[schema.Types.Mixed],
        ref:"autori",
        default:[]
    },
    attori:{
        type:[schema.Types.Mixed],
        ref:"attori",
        required:true},
    rating_esterno:{
        rating:{
            type:Number,
            default:0
        },
        votanti:{
            type:Number,
            default:0
        }
    },
    popolarità_esterna:{
        type:Number,
        default:0
    },
    rating_interno:{
        rating:{
            type:Number,
            min:0,
            max:100,
            default:0
        },
        votanti:{
            type:Number,
            default:0
        }
    },
    popolarità_interna:{
        type:Number,
        default:0
    },
    img: String,
    trama:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("film",film_schema);
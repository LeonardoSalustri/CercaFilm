var mongoose = require("mongoose");
var schema = mongoose.Schema;
var attori = require("./attore.js");
var generi =  require("./genere.js");

var film_schema=new schema({
    _id:{
        type:schema.Types.Number,
    },
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
        type:[schema.Types.String],
        default:[]
    },
    genere:{
        type:[{type:schema.Types.Number,ref:"generi"}],
        deafult:[]
    },
    registi:{
        type:[{type:schema.Types.Number,ref:"registi"}],
        default:[]
    },
    sceneggiatori:{
        type:[{type:schema.Types.Number,ref:"sceneggiatori"}],
        default:[]
    },
    autori:{
        type:[{type:schema.Types.Number,ref:"autori"}],
        default:[]
    },
    attori:{
        type:[{type:schema.Types.Number,ref:"attori"}],
        default:[]
    },
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
    popolarità_interna:{
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
        },
        default:{rating:0,votanti:0}
    },
    img: String,
    trama:{
        type:String,
        default:""
    },
    keywords:{
        type:[{type:schema.Types.Number,ref:"keywords"}],
        default:[]
    }
});

module.exports = mongoose.model("film",film_schema);
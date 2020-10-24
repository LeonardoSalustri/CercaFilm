var mongoose = require("mongoose");
var schema = mongoose.Schema;
var attori = require("./attore.js");

var keyword_schema = new schema({
    _id:{
        type:schema.Types.Number,
    },
    name:{
        type:String,
        required:true,
    },
    film:{
        type:[{type:schema.Types.Number,ref:"films"}],
        default:[]
    }
});


module.exports = mongoose.model("keyword",keyword_schema);

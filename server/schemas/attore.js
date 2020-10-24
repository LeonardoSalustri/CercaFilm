var mongoose = require("mongoose");
var schema = mongoose.Schema;

var attore_schema = new schema({
    _id:{
        type:schema.Types.Number,
    },
    nome:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:""
    },
    film:{
        type:[{type:schema.Types.Number,ref:"films"}],
        default:[]
    }
});

module.exports = mongoose.model("attori",attore_schema);
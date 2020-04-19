var mongoose = require("mongoose");
var schema = mongoose.Schema;

var regista_schema = new schema({
    nome:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("registi",regista_schema);
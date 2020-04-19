var mongoose = require("mongoose");
var schema = mongoose.Schema;

var autore_schema = new schema({
    nome:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("autori",autore_schema);
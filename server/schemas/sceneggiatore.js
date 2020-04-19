var mongoose = require("mongoose");
var schema = mongoose.Schema;

var sceneggiatore_schema = new schema({
    nome:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("sceneggiatori",sceneggiatore_schema);
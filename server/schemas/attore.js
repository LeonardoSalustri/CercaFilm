var mongoose = require("mongoose");
var schema = mongoose.Schema;

var attore_schema = new schema({
    nome:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("attori",attore_schema);
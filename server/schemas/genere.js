var mongoose = require("mongoose");
var schema = mongoose.Schema;

var genere_schema = new schema({
    _id:{
        type:schema.Types.Number,
    },
    nome:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("generi",genere_schema);
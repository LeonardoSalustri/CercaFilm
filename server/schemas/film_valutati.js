var mongoose = require("mongoose");
var schema = mongoose.Schema;

var film_valutato_schema = new schema({
    titolo:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:0,
        max:10,
        default:0
    }
});

module.exports = mongoose.model("film_valutati",film_valutato_schema);
var mongoose = require("mongoose");

var users = require("./schemas/user");
var films = require("./schemas/film");
var registis = require("./schemas/regista");

var config = require("./config");
mongoose.set("useCreateIndex",true);
mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);
mongoose.connect(config.mongoUrl);

films.find({"titolo":"Joker"})
.populate("attori","nome")
.populate("registi","nome")
.then((result)=>{
    console.log(JSON.stringify(result));

});
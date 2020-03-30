const assert = require("assert");

exports.insertDoc=(db,document,collection,callback)=>{
    var coll = db.collection(collection);
    return coll.insertOne(document)
};
exports.findAll=(db,collection,callback)=>{
    var coll = db.collection(collection);
    return coll.find({}).toArray();
};
exports.updateDoc=(db,document,update,collection,callback)=>{

};
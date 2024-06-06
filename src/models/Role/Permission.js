const mongoose = require('mongoose');

const DatabaseSchema = mongoose.Schema({
    name:{type:String,required:true},
},{timestamps:true,versionKey:false});

const Permission = mongoose.model('Permission',DatabaseSchema);
module.exports = Permission
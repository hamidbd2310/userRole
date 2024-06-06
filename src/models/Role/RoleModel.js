const mongoose = require('mongoose');

const DatabaseSchema = mongoose.Schema({
    name:{type:String,required:true},
    businessID:{type:mongoose.Schema.Types.ObjectId, required:true},
},{timestamps:true,versionKey:false});

const RoleModel = mongoose.model('role',DatabaseSchema);
module.exports = RoleModel
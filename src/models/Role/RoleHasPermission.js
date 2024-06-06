const mongoose = require('mongoose');

const DatabaseSchema = mongoose.Schema({
    roleID:{type:mongoose.Schema.Types.ObjectId, required:true},
    permissionID:{type:mongoose.Schema.Types.ObjectId, required:true},
},{timestamps:true,versionKey:false});

const RoleHasPermission = mongoose.model('RoleHasPermission',DatabaseSchema);
module.exports = RoleHasPermission
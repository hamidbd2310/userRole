const mongoose = require('mongoose');

const BusinessModelSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    name: { type: String, required: true },
    contactNumber: { type: String },
    contactNumber2: { type: String },
    address: { type: String },
    email: { type: String },
    website: { type: String },
    description: { type: String },
    category: { type: String },
    logo: { type: String },
    openingHours: { type: String },
}, { timestamps: true, versionKey: false });

const BusinessModel = mongoose.model('Business', BusinessModelSchema);
module.exports = BusinessModel;
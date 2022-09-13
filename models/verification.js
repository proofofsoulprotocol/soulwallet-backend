const mongoose = require('mongoose');
const config = require('../config');

const verificationSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        index: true
    },
    code: {
        require: true,
        type: String
    },
    date: {
        require: true,
        type: Date,
        default: Date.now,
        index: true,
        expires: config.verifyExpireMinutes * 60
    }
});

module.exports = mongoose.model('Verification', verificationSchema);
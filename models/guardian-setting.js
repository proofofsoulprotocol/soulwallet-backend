const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const guardianSettingSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        index: true,
        unique: true
    }, 
    wallet_addresses: {//maybe EOA wallet or Email? twitter? contract wallet address?
        required: false,
        type: String,
        index: true,
        unique: true, //one email, one wallet
    },
    total: {
        required: false,
        type: String,
    },
    min: {
        required: false,
        type: String,
    },
    has_default: {
        required: false,
        type: Boolean,
        default: true,
    },
    setting: {
        required: false,
        type: String,
    }
})

module.exports = mongoose.model('GuardianSetting', guardianSettingSchema);
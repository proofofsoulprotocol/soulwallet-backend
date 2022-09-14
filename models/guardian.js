const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const guardianSchema = new mongoose.Schema({
    guardian_address: {
        required: true,
        type: String,
        index: true,
        unique: true
    }, //maybe EOA wallet or Email? twitter? contract wallet address?
    wallet_addresses: {
        required: false,
        type: Array,
        index: true,
        unique: true,
    }
})

module.exports = mongoose.model('Guardian', guardianSchema);
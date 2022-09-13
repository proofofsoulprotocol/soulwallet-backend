const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const accountSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        index: true,
        unique: true
    },
    wallet_address: {
        required: false,
        type: String,
        index: true,
        unique: true,
    },
    guardians: {
        required: false,
        type: Array
    }
})

module.exports = mongoose.model('Account', accountSchema);
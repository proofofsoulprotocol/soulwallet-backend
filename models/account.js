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
        required: true,
        type: String,
        index: true,
        unique: true,
    },
    key: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('Account', accountSchema);
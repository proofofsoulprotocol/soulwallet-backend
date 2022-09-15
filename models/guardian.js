const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const guardianSchema = new mongoose.Schema({
    guardian_address: { // guardian's wallet address
        required: false,
        type: String,
        index: true,
        unique: true,
    },
    watch_wallet_list: { //contract wallet address and email
        required: true,
        type: Array
    }
})

module.exports = mongoose.model('Guardian', guardianSchema);
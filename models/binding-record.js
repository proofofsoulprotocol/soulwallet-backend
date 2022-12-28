const mongoose = require('mongoose');
const config = require('../config');

const bindingRecordSchema = new mongoose.Schema({
    wallet_address: {
        required: true,
        type: String,
        index: true
    },
    binding_item: {
        require: true,
        type: Array
    },
    date: {
        require: true,
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BindingRecord', bindingRecordSchema);
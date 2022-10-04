const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const wishlistSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        index: true,
        unique: true
    },
    timeSigned: {
        required: true,
        type: Date,
        default: Date.now,
        unique: false, // todo 
    }

})

module.exports = mongoose.model('WishList', wishlistSchema);

var config = {};
config.mongodb = process.env.MONGODB_URI;
console.log("ENV",process.env.MONGODB_URI)
// config.mongodb = "mongodb+srv://soulwalletbackend:X1SYvvRqLIRu8mVX@cluster0.b66i3qq.mongodb.net/?retryWrites=true&w=majority";
// config.mongodb = "mongodb://127.0.0.1:27017/soulwallet";
module.exports = config;
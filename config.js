
var config = {};

config.env = process.env.NODE_ENV || "development";

if (config.env === "production") {
    config.mongodbURI = process.env.MONGODB_URI;
    config.mongodbConfig = {
            ssl: true,
            sslValidate: true,
            sslCA: `${__dirname}/aws-rds-combined-ca-bundle.pem`
        }
} else {
    config.mongodbURI = "mongodb://127.0.0.1:27017/soulwallet";
    config.mongodbConfig = {};
}

console.log("ENV",process.env.MONGODB_URI)

module.exports = config;
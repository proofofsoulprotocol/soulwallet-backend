var { expressjwt: jwt } = require('express-jwt');
const config = require('../config')

const jwtMiddleware = jwt({
    secret: config.jwtKey,
    algorithms: ["HS256"]
});

module.exports = jwtMiddleware;
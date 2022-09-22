
const retRsp = (rsp, code, msg, data = {}) => {
    msg =  msg[0].toUpperCase() + msg.substr(1); // Upper first character
return rsp.json({
    "code": code, // 200, 201, 401, 500
    "msg": msg,
    "data": data
});
};


module.exports = {retRsp};
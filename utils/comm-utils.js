
const retRsp = (rsp, code, msg, data = {}) => {
return rsp.json({
    "code": code, // 200, 201, 401, 500
    "msg": msg,
    "data": data
});
};


module.exports = {retRsp};
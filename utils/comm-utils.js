const errRsp = (rsp, code, msg) => {
    rsp.status(code).json({
      "error": {
        "code": code,
        "message": msg
      }
    });
  };
  
const succRsp = (rsp, data) => {
return rsp.json({
    "data": data
});
};
  

module.exports = {errRsp, succRsp};
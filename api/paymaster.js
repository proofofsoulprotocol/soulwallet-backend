var Account = require("../models/account");
var commUtils = require("../utils/comm-utils");
const config = require("../config");
const axios = require("axios");

// wallet_address, new_key, 
async function triggerReplaceKey(req, rsp, next) {
  
  const baseUrl = config.baseUrl;
  
  var exists = false;
  const result = await Account.find({email: req.body.email});
  if (result.length > 0) {
    exists = true;
  }
  return commUtils.retRsp(rsp, 200, "", {
    exists: exists
  });
}


module.exports = {triggerReplaceKey};
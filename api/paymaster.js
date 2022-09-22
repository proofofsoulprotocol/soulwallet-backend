var Account = require("../models/account");
var commUtils = require("../utils/comm-utils");
const Verification = require("../models/verification");
const config = require("../config");
const crypto = require("crypto");


async function triggerReplaceKey(req, rsp, next) {
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
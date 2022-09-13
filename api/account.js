var Account = require("../models/account");
var commUtils = require("../utils/comm-utils");
const config = require("../config");
// const crypto = require("crypto");
// addAccount, updateAccountGuardian, updateAccount, isWalletOwner

const findAccount = (options) => {
    const givenSet = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    var code = "";
    for (var i = 0; i < length; i++) {
        code += givenSet[crypto.randomInt(0, givenSet.length)];
    }
    return code;
}

async function addAccount(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.errRsp(rsp, 400, "invalid email");
    }

    if (typeof req.body.code !== 'string') {
        return commUtils.errRsp(rsp, 400, "empty code");
    }
    const code = req.body.code.toUpperCase();

    const result = await Verification.find({email: req.body.email, code: code});
    // TODO: set jwt
    return commUtils.succRsp(rsp, {
        verified: result.length > 0
    });
}

async function updateAccountGuardian(req, rsp, next) {
  var exists = false;
  const result = await Account.find({email: req.body.email});
  if (result.length > 0) {
    exists = true;
  }
  rsp.json({
    params: req.body,
    exists: exists
  })
}

async function updateAccount(req, rsp, next) {
    var exists = false;
    const result = await Account.find({email: req.body.email});
    if (result.length > 0) {
      exists = true;
    }
    rsp.json({
      params: req.body,
      exists: exists
    })
  }

  async function isWalletOwner(req, rsp, next) {
    var exists = false;
    const result = await Account.find({email: req.body.email});
    if (result.length > 0) {
      exists = true;
    }
    rsp.json({
      params: req.body,
      exists: exists
    })
  }


module.exports = {addAccount, updateAccountGuardian, updateAccount, isWalletOwner};
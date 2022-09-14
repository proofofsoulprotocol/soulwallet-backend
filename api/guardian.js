var Account = require("../models/account");
var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
const config = require("../config");


async function getAccountGuardian(req, rsp, next) {
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

async function addAccountGuardian(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.errRsp(rsp, 400, "invalid email");
    }

    const account = new Account({
        email: req.body.email,
        wallet_address: req.body.wallet_address
    })
    var msg = "Add record successfully.";
    try {
        const accountToSave = await account.save();
    }
    catch (error) {
        msg="Save record error"
    }
    return commUtils.succRsp(rsp, {
        message: msg
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


module.exports = {getAccountGuardian, addAccountGuardian, updateAccountGuardian};
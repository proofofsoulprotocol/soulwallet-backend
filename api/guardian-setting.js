var GuardianSetting = require("../models/guardian-setting");
var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
// const config = require("../config");

async function addGuardianSetting(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.errRsp(rsp, 400, "invalid email");
    }

    const guardian_setting = new GuardianSetting({
        email: req.body.email,
        wallet_address: req.body.wallet_address,
        total: req.body.total,
        min  : req.body.min,
        has_default: req.body.has_default,
        setting: req.body.setting
    })
    var msg = "Add record successfully.";
    try {
        const gsToSave = await guardian_setting.save();
        console.log("save guardian setting:",gsToSave);
    }
    catch (error) {
        msg="Save record error";
        console.log("Error:",error);
    }
    return commUtils.succRsp(rsp, {
        message: msg
    });
}

async function updateGuardianSetting(req, rsp, next) {
    var updated = false;
    const account = await Account.find({email: req.body.email});
    console.log(account);
    if (account.length > 0) {
        updated = true;
        account[0].wallet_address = req.body.wallet_address; // one email force one wallet address
        account[0].save();
    }
    rsp.json({
      params: req.body,
      update: updated
    })
  }


module.exports = {addGuardianSetting, updateGuardianSetting};
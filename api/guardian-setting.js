var GuardianSetting = require("../models/guardian-setting");
var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
// const config = require("../config");

async function addGuardianSetting(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "Invalid email");
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
    return commUtils.retRsp(rsp, 200, msg);
}

// It will update with filter: email and wallet_address 
// and replace the database record by your specific post value
async function updateGuardianSetting(req, rsp, next) {
    const guardianSetting = await GuardianSetting.findOneAndUpdate(
        {email: req.body.email, wallet_address: req.body.wallet_address}, 
        {$set:{
            wallet_address: req.body.wallet_address,
            total: req.body.total,
            min  : req.body.min,
            has_default: req.body.has_default,
            setting: req.body.setting
        }});
    
    console.log("update result:",guardianSetting);
    
    var msg = guardianSetting ? "Update successfully!" : "Update failed!";
    return commUtils.retRsp(rsp, 200, msg,  {
        params: guardianSetting,
        update: guardianSetting ? true : false,
    });
  }


module.exports = {addGuardianSetting, updateGuardianSetting};
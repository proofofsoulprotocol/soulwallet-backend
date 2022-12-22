var Account = require("../models/account");
const { validateEmail, sendVerifyCode } = require("../utils/email-utils");
var commUtils = require("../utils/comm-utils");
const BindingRecord = require("../models/binding-record");
const config = require("../config");
const crypto = require("crypto");


const validateBindingData = (binding) => {
    if("jwt" in binding){
        if("wallet_address" in binding){
            if("binding_item" in binding){
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    } else {
        return false;
    }
};


async function addBinding(req, rsp, next) {
    if (!validateBindingData(req.body.binding)) {
        return commUtils.retRsp(rsp, 400, "Invalid binding record.");
    }

    // record
    const bindingRecord = BindingRecord({
        wallet_address: req.body.wallet_address,
        binding_item: req.body.binding_item,
        date: new Date()
    });
    await bindingRecord.save();

    return commUtils.retRsp(rsp, 200, "bindingRecord added successfully.", {})
}


async function removeBinding(req, rsp, next) {

    const result = await BindingRecord.findOneAndDelete({"wallet_address": req.body.remove_items.wallet_address, 
        "type": req.body.remove_items.type, "value":req.body.remove_items.value});
    if(result){
        return commUtils.retRsp(rsp, 200, "", result);
    } else
    {
        return commUtils.retRsp(rsp, 500, "", result);
    }
    
}

async function _isBindingExists(req, rsp, next) {
  var exists = false;
  const result = await BindingRecord.findOne({"wallet_address": req.body.wallet_address});
    if(result){
        for(let i=0;i<result.length;i++){
            if((req.body.type in result[i].type)&& (req.body.value in result[i].value)){
                exists = true;
            }
        }
    return commUtils.retRsp(rsp, 200, "", result);
    } else {
    return commUtils.retRsp(rsp, 500, "", result);
    }
}


module.exports = {addBinding, _isBindingExists, removeBinding};
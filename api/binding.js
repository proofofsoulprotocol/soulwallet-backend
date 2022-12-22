var Account = require("../models/account");
const { validateEmail, sendVerifyCode } = require("../utils/email-utils");
var commUtils = require("../utils/comm-utils");
const BindingRecord = require("../models/binding-record");
const config = require("../config");
const crypto = require("crypto");


const validateBindingData = (binding) => {
    
    if(!("jwt" in binding))
        return false;
    if(!("wallet_address" in binding))
         return false;
    if(!("binding_item" in binding)) 
        return false;

    return true;
};


async function addBindingRecord(req, rsp, next) {
    if(!validateBindingData(req.body.binding)) {
        return commUtils.retRsp(rsp, 400, "Invalid binding record.");
    }

    // record
    const bindingRecord = new BindingRecord({
        wallet_address: req.body.wallet_address,
        type: req.body.type,
        value: req.body.value,
        // todo array
        date: new Date()
    });
    await bindingRecord.save();

    return commUtils.retRsp(rsp, 200, "bindingRecord added successfully.", {})
}


async function deleteRecord(req, rsp, next) {

    const result = await BindingRecord.findOneAndDelete({"wallet_address": req.body.remove_items.wallet_address, 
        "type": req.body.remove_items.type, "value":req.body.remove_items.value});
        // todo array
    if(result){
        return commUtils.retRsp(rsp, 200, "", result);
    } else
    {
        return commUtils.retRsp(rsp, 500, "", result);
    }
    
}

// find the special one
async function _isBindingRelationExists(req, rsp, next) {
  var exists = false;
  const result = await BindingRecord.findOne({"wallet_address": req.body.wallet_address, "type": req.body.type, "value": req.body.value});
    if(result){
        for(let i=0;i<result.length;i++){
            if((req.body.type in result[i].type)&& (req.body.value in result[i].value)){
                exists = true;
                break;
            }
        }
    return commUtils.retRsp(rsp, 200, "", result);
    } else {
    return commUtils.retRsp(rsp, 200, "", false);
    }
}


module.exports = {addBindingRecord, _isBindingRelationExists, deleteRecord};
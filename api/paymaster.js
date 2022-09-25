var Account = require("../models/account");
const config = require("../config");
const axios = require("axios");

// wallet_address, new_key, recovery_records(guardian_address, signature)
// It will invoked by the updateRecoveryRecord when the condition meets the 2/3.
async function triggerReplaceKey(wallet_address, new_key, recovery_record) {
  
  const baseUrl = config.baseUrl;
  var postData = {
    "wallet_address": wallet_address,
    "new_key": new_key,
    "recovery_record": recovery_record
  }
  const methodName = "triggerReplaceOnChainKey";
  const rtData = await axios.post(baseUrl+methodName, postData).then((response)=>{
      console.log(response.data);
    }).catch((error)=>{
      console.log(error);
    });
  return rtData;
}


module.exports = {triggerReplaceKey};
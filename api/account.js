var Account = require("../models/account");
var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
const config = require("../config");
const { verifyEmailCode } = require('./verify');
const jwt = require('jsonwebtoken');
// const crypto = require("crypto");
// addAccount, updateAccountGuardian, updateAccount, isWalletOwner

async function findAccount(mail) {
    const result = await Account.find({email: mail });
    return result;
}

async function addAccount(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "Invalid email");
    }
    if (typeof req.body.code != 'string') {
      return commUtils.retRsp(rsp, 400, "Email verify code not exist.");
    }

    const codeValid = await verifyEmailCode(req.body.email, req.body.code);
    if (!codeValid) {
      return commUtils.retRsp(rsp, 400, "Code is not valid.");
    }

    const account = new Account({
        email: req.body.email, // one email, one wallet
        wallet_address: req.body.wallet_address
    })
    var msg = "Add record successfully.";
    try {
        const accountToSave = await account.save();
    }
    catch (error) {
        msg="Save record error";
        console.log("error:",error);
    }

    console.log(config.jwtKey);
    jwtToken = jwt.sign({
      email: req.body.email,
      wallet_address: req.body.wallet_address
    }, config.jwtKey, { expiresIn: config.jwtExpiresInSecond});

    return commUtils.retRsp(rsp, 200, msg, {
        jwtToken
    });
}

// async function updateAccountGuardian(req, rsp, next) {
//   var exists = false;
//   const result = await Account.find({email: req.body.email});
//   if (result.length > 0) {
//     exists = true;
//   }
//   rsp.json({
//     params: req.body,
//     exists: exists
//   })
// }

async function updateAccount(req, rsp, next) {
    var updated = false;
    const account = await Account.findOne({email: req.body.email});
    console.log(account);
    if (account) {
        updated = true;
        account.wallet_address = req.body.wallet_address; // one email force one wallet address
        account.save();
    }
    rsp.json({
      params: account,
      update: updated
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

  async function addAccountGuardian(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "Invalid email");
    }
    var guardian = req.body.guardian;
    console.log("guardian will be added:",guardian);

    const account = await Account.findOne({email: req.body.email, wallet_address: req.body.wallet_address});
    var msg = "";
    if (account === null) {
      msg = "Has no record of your mail and wallet_address:"+req.body.email+":::"+ req.body.wallet_address;
      return commUtils.retRsp(rsp, 404, msg);
    }
    console.log("account guardian is ",account.guardians);
    var gIndex = (account.guardians).indexOf(req.body.guardian);
    if(gIndex>-1){
      msg ="The guardian "+req.body.guardian+ " you want to add has exists in your guardian list."
      return commUtils.retRsp(rsp, 400, msg);
    }
    msg = "Add guardian successfully.";
    try { // maybe can improved and refactor
      const update_guardian = await Account.findOneAndUpdate({email: req.body.email, wallet_address: req.body.wallet_address}, {$addToSet:{guardians: guardian}});
      console.log("update result:",update_guardian);
    }
    catch (error) { // has some problems on return msgs
        msg="Add guardian record error";
        console.log("Error Obj:",update_guardian);
        console.log("Msg",msg);
    }
    console.log();
    return commUtils.retRsp(rsp, 200, "Added record successfully!");
}


async function updateAccountGuardian(req, rsp, next) {
  const account = await Account.findOne({email: req.body.email});
  var msg = "";
  if (account === null) {
    msg = "Has no record of your mail:"+req.body.email;
  }
  var gIndex = (account.guardians).indexOf(req.body.guardian_old);
  var gIndex2 = (account.guardians).indexOf(req.body.guardian_new);
  if(gIndex2>-1){
    msg ="The guardian "+req.body.guardian_new+ " you want to update has exists in your guardian list."
  }
  console.log("old,new,index",req.body.guardian_old, account.guardians, gIndex);
  console.log("new guardian in guardians' gIndex2",gIndex2);
  if((gIndex>-1)&(gIndex2===null)){
    account.guardians[gIndex]= req.body.guardian_new;
    msg = "Replace the old:"+req.body.guardian_old+" with "+req.body.guardian_new;
    var replace = await account.save();
    console.log("replace:",replace);
  }
  commUtils.retRsp(rsp, 200, msg);
}

async function getAccountGuardian(req, rsp, next) {
  const result = await Account.findOne({email: req.body.email, wallet_address: req.body.wallet_address});
  var msg = "";
  if (!result) {
    msg = "Has no record of your Account:"+req.body.email;
    console.log(result);
    return commUtils.retRsp(rsp, 200, msg, []);
  }

  rtData = result ? result.guardians : null ;

  console.log("rtData:",rtData);
  commUtils.retRsp(rsp, 200, msg, rtData);
}

async function delAccountGuardian(req, rsp, next) {
  const account = await Account.findOneAndUpdate(
    {email: req.body.email,wallet_address: req.body.wallet_address},
    {$pull: {guardians: req.body.guardian }}
    );
  var msg = "";
  if (!account) {
    msg = "Has no record of your Account:" + req.body.email;
    return commUtils.retRsp(rsp, 404, msg);
  }
  var guardians = account.guardians;
  if (guardians.indexOf(req.body.guardian) < 0) {
    msg = req.body.guardian + " is not your guardian";
    return commUtils.retRsp(rsp, 404, msg);
  }

  guardians.remove(req.body.guardian);
  msg = "Guardian " + req.body.guardian + " remove succeed";
  commUtils.retRsp(rsp, 200, msg, guardians);
}



// module.exports = {addAccount, updateAccountGuardian, updateAccount, isWalletOwner};
module.exports = {addAccount, updateAccount, isWalletOwner, getAccountGuardian, addAccountGuardian, delAccountGuardian, updateAccountGuardian};
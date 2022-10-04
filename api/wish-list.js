var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
const WishList = require("../models/wish-list");


async function addToList(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "Invalid email");
    }else{
      const isExists = await WishList.findOne({email: req.body.email});
      console.log("isExists:",isExists);
        if(isExists){
          return commUtils.retRsp(rsp, 400, "Your mail has got list already!");
        }
    }

    const wishlist = new WishList({
        email: req.body.email, // one email, one time
    })
    var msg = "Add to list successfully.";
    try {
        const listToSave = await wishlist.save();
        console.log("listToSave:",listToSave);
    }
    catch (error) {
        msg="Save record error:"+ req.body.email;
        console.log("error:",error);
        console.log("listToSave:", listToSave);
        return commUtils.retRsp(rsp, 400, msg);
        
    }
    
    return commUtils.retRsp(rsp, 200, msg, req.body.email);
}

async function getAccounts(req, rsp, next) {
  const accounts = await Account.find({ email: req.body.email });
  return commUtils(rsp, 200, "", accounts);
}

async function getWalletAddress(req, rsp, next) {
  let wallet_address;
  let msg = "";
  if (req.body.email) {
    msg = "Find by email";
    let account = await Account.findOne({email: req.body.email});
    if (account) {
      wallet_address = account.wallet_address;
    }
  } else if (req.body.key) {
    msg = "Find by key";
    let account = await Account.findOne({key: req.body.key});
    if (account) {
      wallet_address = account.wallet_address;
    } else {
      let recoveryRecord = await RecoveryRecord.findOne({new_key: req.body.key});
      if (recoveryRecord) {
        wallet_address = recoveryRecord.wallet_address;
      }
    }
  }
  if (!wallet_address) {
    return commUtils.retRsp(rsp, 404, "Account not found");
  }
  return commUtils.retRsp(rsp, 200, msg, {
    wallet_address: wallet_address
  });
}

async function updateAccount(req, rsp, next) {
    var updated = false;
    const email = req.auth.email;
    const account = await Account.findOne({email: email});
    console.log(account);
    if (account) {
        if (req.body.wallet_address) {
          updated = true;
          account.wallet_address = req.body.wallet_address; // one email force one wallet address
        }
        if (req.body.key) {
          updated = true;
          account.key = req.body.key;
        }
        await account.save();
    }

    var msg = updated ? "Updated" : "Not Updated";
    return commUtils.retRsp(rsp, 200, msg, {
      params: account,
      update: updated
    });
  }

  async function isWalletOwner(req, rsp, next) {
    const result = await Account.find({email: req.body.email});
    if (result.length < 1) {
      return commUtils.retRsp(rsp, 502, "No record", result);
    }
    return commUtils.retRsp(rsp, 200, "Find your record:", result);
  }

async function addAccountGuardian(req, rsp, next) {
    const email = req.auth.email;
    var guardian = req.body.guardian;
    console.log("guardian will be added:", guardian);

    const account = await Account.findOne({email: email, wallet_address: req.body.wallet_address});
   
    msg = "Add guardian successfully.";
    try { // maybe can improved and refactor
      const update_guardian = await Account.findOneAndUpdate({email: email, wallet_address: req.body.wallet_address}, {$addToSet:{guardians: guardian}});
      console.log("update result:",update_guardian);
    }
    catch (error) { // has some problems on return msgs
        msg="Add guardian record error";
        console.log("Error Obj:",update_guardian);
        console.log("Msg",msg);
        return commUtils.retRsp(rsp, 400, msg);
    }
    await addGuardianWatchListFunc(req.body.wallet_address, req.body.guardian);
    return commUtils.retRsp(rsp, 200, "Added record successfully!");
}


async function updateAccountGuardian(req, rsp, next) {
  const email = req.auth.email;
  const account = await Account.findOne({email: email});
  var msg = "";
  if (account === null) {
    msg = "Has no record of your mail:"+mail;
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
  const email = req.auth.email;
  const result = await Account.findOne({email: email, wallet_address: req.body.wallet_address});
  var msg = "";
  if (!result) {
    msg = "Has no record of your Account:" + email;
    console.log(result);
    return commUtils.retRsp(rsp, 200, msg, []);
  }

  rtData = result ? result.guardians : null ;

  console.log("rtData:",rtData);
  commUtils.retRsp(rsp, 200, msg, rtData);
}

async function delAccountGuardian(req, rsp, next) {
  const email = req.auth.email;
  const account = await Account.findOneAndUpdate(
    {email: email, wallet_address: req.body.wallet_address},
    {$pull: {guardians: req.body.guardian }}
    );
  var msg = "";
  if (!account) {
    msg = "Has no record of your Account:" + email;
    return commUtils.retRsp(rsp, 404, msg);
  }
  var guardians = account.guardians;
  if (guardians.indexOf(req.body.guardian) < 0) {
    msg = req.body.guardian + " is not your guardian";
    return commUtils.retRsp(rsp, 404, msg);
  }

  guardians.remove(req.body.guardian);
  await delGuardianWatchListFunc(req.body.wallet_address, req.body.guardian);
  msg = "Guardian " + req.body.guardian + " remove succeed";
  commUtils.retRsp(rsp, 200, msg, guardians);
}


module.exports = {addToList};
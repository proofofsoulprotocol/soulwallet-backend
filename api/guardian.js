var Guardian = require("../models/guardian");
const RecoveryRecord = require("../models/recovery-record");
var commUtils = require("../utils/comm-utils");


async function addGuardianWatchList(req, rsp, next) {
    var msg = "Oh no signal";
    const guardianR = await Guardian.findOne({guardian_address: req.body.guardian_address}).then(
        function(err, guardian){
            console.log("query and get a guardian:",guardian);
            if(!guardian){ // not exists, then insert new
                console.log("guardian zero:",guardian);
                    const guardianAdd = new Guardian({
                        guardian_address: req.body.guardian_address,
                        wallet_address: req.body.wallet_address,
                    });
                    try{
                         guardianAdd.save();
                         console.log("try to Add one!");
                    }
                    catch(error){
                        msg = "Insert new error";
                        console.log("Add new guardian error", error);
                    }
            }else{
                // if exists guardian, then depends on the wallet address exists or not
                console.log("guardian has:",guardian);
                var gIndex = (guardian.watch_wallet_list).indexOf(req.body.wallet_address);
                if(gIndex>-1){
                  msg ="The contract wallet address: "+req.body.wallet_address+ " you want to add has exists in your watch list."
                }else{
                    guardian.watch_wallet_list[gIndex+1] = wallet_address;
                    guardian.save();
                }
            }            
        }
    );
    return commUtils.retRsp(rsp, 200, msg, guardianR);
}

// to be discuss: query each wallet_address on recovery record
async function getPendingRecoveryRecord(req, rsp, next) {
    const guardian = await Guardian.findOne(
        {guardian_address: req.body.guardian_address}, function(error, guardian)
        {
            console.log("get result:",guardian);
            RecoveryRecord.find({wallet_address: {$in: guardian.watch_wallet_list}},
                function(error, recoveryRecords){
                    console.log("recoveryRecords:",recoveryRecords);
                });
        }
    );
    
    var msg = recoveryRecords ? "Query successfully!" : "Query failed!";
    return commUtils.retRsp(rsp, 200, msg, {
        params: recoveryRecords,
        success: recoveryRecords ? true : false,
    });
  }
  
  async function getGuardianWatchList(req, rsp, next) {
    const guardian = await Guardian.findOne( // unique guardian_address
        {guardian_address: req.body.guardian_address});
    
    console.log("get result:",guardian);
    
    var msg = guardian ? "Find successfully!" : "Find failed!";
    return commUtils.retRsp(rsp, 200, msg, guardian);
  }

// It will update with filter: email and wallet_address 
// and replace the database record by your specific post value
async function updateGuardianWatchList(req, rsp, next) {
    const wallet_address = req.body.wallet_address;
    const guardian = await Guardian.findOneAndUpdate(
        {guardian_address: req.body.guardian_address}, 
        {
            $addToSet:{ watch_wallet_list: wallet_address}
        });
    
    console.log("update result:",guardian);
    
    var msg = guardianSetting ? "Update successfully!" : "Update failed!";
    return commUtils.retRsp(rsp, 200, msg, {
        params: guardianSetting,
        update: guardianSetting ? true : false
    });
  }


module.exports = {addGuardianWatchList, getGuardianWatchList, getPendingRecoveryRecord, updateGuardianWatchList};
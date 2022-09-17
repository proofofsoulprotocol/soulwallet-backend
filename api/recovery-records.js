const RecoveryRecord = require("../models/recovery-record");
const commUtils = require("../utils/comm-utils");

async function addRecoveryRecord(req, rsp, next) {
    // TODO: check params

    const result = await RecoveryRecord.findOneAndUpdate({
        wallet_address: req.body.wallet_address
    }, {}, {
        new: true,
        upsert: true
    });

    // TODO: this is not atomic
    updated = false;
    for (var i = 0; i < result.recovery_records.length; i++) {
        if (result.recovery_records[i].guardian_address === req.body.guardian_address) {
            // update signature
            result.recovery_records[i].signature = req.body.signature;
        }
    }
    if (!updated) {
        result.recovery_records.push({
            guardian_address: req.body.guardian_address,
            signature: req.body.signature
        })
    }
    await result.save();

    return commUtils.retRsp(rsp, 200, "add success", result)
}


async function fetchRecoveryRecords(req, rsp, next) {
    const result = await RecoveryRecord.findOne({
        wallet_address: req.body.wallet_address
    });
    if (!result) {
        return commUtils.retRsp(rsp, 404, "wallet address not found");
    }

    return commUtils.retRsp(rsp, 200, "success", {
        recovery_records: result.recovery_records
    });
}

module.exports = {addRecoveryRecord, fetchRecoveryRecords};
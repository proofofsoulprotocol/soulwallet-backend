const RecoveryRecord = require("../models/recovery-record");
const Guardian_setting = require("../models/guardian-setting");
const commUtils = require("../utils/comm-utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { verifyEmailCode } = require("./verify");

async function addRecoveryRecord(req, rsp, next) {
    // 1. verify code
    const verified = await verifyEmailCode(req.body.email, req.body.code);
    if (!verified) {
        return commUtils.retRsp(rsp, 400, "Code verify failed");
    }

    // 2. find existing
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (result) {
        return commUtils.retRsp(rsp, 400, "Recovery record already exists");
    }

    // 3. create records
    // TODO: add guardian in array
    const record = new RecoveryRecord({
        email: req.body.email,
        new_key: req.body.new_key,
        recovery_records: []
    });
    await record.save();

    const jwtToken = jwt.sign({
        wallet_address: req.body.email
    }, config.jwtKey, {expiresIn: config.jwtExpiresInSecond});

    return commUtils.retRsp(rsp, 200, "Added successfully!", {
        jwtToken
    })
}


async function updateRecoveryRecord(req, rsp, triggerPaymasterReplace) {
    // TODO: validate signature
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (!result) {
        return commUtils.retRsp(rsp, 404, "Recovery record not found");
    }

    updated = false;
    for (var i = 0; i < result.recovery_records.length; i++) {
        if (result.recovery_records[i].guardian_address === req.body.guardian_address) {
            // update signature
            result.recovery_records[i].signature = req.body.signature;
            updated = true;
        }
    }
    if (!updated) {
        return commUtils.retRsp(rsp, 400, "Guardian not in list");
    }

    await result.save();

    return commUtils.retRsp(rsp, 200, "Updated!");
}

// invoke the API of Paymaster server, do not wait for reply
function triggerPaymasterReplace(email, wallet_address, new_key){
    const baseUrlPaymaster ="";
}

async function fetchRecoveryRecords(req, rsp, next) {
    const rrRecord = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (!rrRecord) {
        return commUtils.retRsp(rsp, 404, "Wallet address not found");
    }
    const gsRecord = await Guardian_setting.findOne({email: req.body.email});
    const rtData = {
        total: gsRecord.total,
        min: gsRecord.min,
        signedNum: rrRecord.guardians.length
    };
    return commUtils.retRsp(rsp, 200, "Success!", {
        recovery_records: rtData
    });
}

async function clearRecoveryRecords(req, rsp, next) {
    // TODO: validate code
    const result = await RecoveryRecord.findOneAndDelete({
        email: req.body.email
    });

    if (!result) {
        return commUtils.retRsp(rsp, 404, "Record not found");
    }
    return commUtils.retRsp(rsp, 200, "Deleted");
}

module.exports = {addRecoveryRecord, updateRecoveryRecord, clearRecoveryRecords, fetchRecoveryRecords};
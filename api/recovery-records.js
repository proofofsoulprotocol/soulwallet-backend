const RecoveryRecord = require("../models/recovery-record");
const commUtils = require("../utils/comm-utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { verifyEmailCode } = require("./verify");

async function addRecoveryRecord(req, rsp, next) {
    // 1. verify code
    const verified = await verifyEmailCode(req.body.email, req.body.code);
    if (!verified) {
        return commUtils.retRsp(rsp, 400, "code verify failed");
    }

    // 2. find existing
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (result) {
        return commUtils.retRsp(rsp, 400, "recovery record already exists");
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

    return commUtils.retRsp(rsp, 200, "added", {
        jwtToken
    })
}


async function updateRecoveryRecord(req, rsp, next) {
    // TODO: validate signature
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (!result) {
        return commUtils.retRsp(rsp, 404, "recovery record not found");
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
        return commUtils.retRsp(rsp, 400, "guardian not in list");
    }

    await result.save();

    return commUtils.retRsp(rsp, 200, "updated");
}

async function fetchRecoveryRecords(req, rsp, next) {
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (!result) {
        return commUtils.retRsp(rsp, 404, "wallet address not found");
    }

    return commUtils.retRsp(rsp, 200, "success", {
        recovery_records: result.recovery_records
    });
}

async function clearRecoveryRecords(req, rsp, next) {
    // TODO: validate code
    const result = await RecoveryRecord.findOneAndDelete({
        email: req.body.email
    });

    if (!result) {
        return commUtils.retRsp(rsp, 404, "record not found");
    }
    return commUtils.retRsp(rsp, 200, "deleted");
}

module.exports = {addRecoveryRecord, updateRecoveryRecord, clearRecoveryRecords, fetchRecoveryRecords};
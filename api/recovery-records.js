const RecoveryRecord = require("../models/recovery-record");
const Guardian_setting = require("../models/guardian-setting");
const commUtils = require("../utils/comm-utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { verifyEmailCode } = require("./verify");
const Account = require('../models/account');

async function addRecoveryRecord(req, rsp, next) {
    // 1. verify code
    const verified = await verifyEmailCode(req.body.email, req.body.code);
    if (!verified) {
        return commUtils.retRsp(rsp, 400, "Code verify failed");
    }
    if (typeof req.body.new_key !== 'string') {
        return commUtils.retRsp(rsp, 400, "Require new_key");
    }

    // 2. find existing
    const result = await RecoveryRecord.findOne({
        email: req.body.email
    });
    if (result) {
        return commUtils.retRsp(rsp, 400, "Recovery record already exists");
    }

    // 3. create records
    const account = await Account.findOne({
        email: req.body.email
    });
    if (!account) {
        return commUtils.retRsp(rsp, 404, "Account not found");
    }
    const guardians = account.guardians;
    var recovery_records = [];
    for (var i = 0; i < guardians.length; i++) {
        recovery_records.push({
            guardian_address: guardians[i]
        })
    }

    const record = new RecoveryRecord({
        email: req.body.email,
        new_key: req.body.new_key,
        wallet_address: account.wallet_address, // add owner's contract wallet_address
        recovery_records: recovery_records
    });
    await record.save();

    const jwtToken = jwt.sign({
        email: req.body.email,
        wallet_address: account.wallet_address,
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

    const total = rrRecord.recovery_records.length;
    var signedNum = 0;
    for (var i = 0; i < total; i++) {
        if (rrRecord.recovery_records[i].signature) {
            signedNum += 1;
        }
    }
    const min = Math.floor(total / 2) + 1;

    // const gsRecord = await Guardian_setting.findOne({email: req.body.email});
    const rtData = {
        total: total,
        min: min,
        signedNum: signedNum
    };
    return commUtils.retRsp(rsp, 200, "Success!", {
        recoveryRecords: rrRecord,
        requirements: rtData
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
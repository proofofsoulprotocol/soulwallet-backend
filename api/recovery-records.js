const RecoveryRecord = require("../models/recovery-record");
const Guardian_setting = require("../models/guardian-setting");
const commUtils = require("../utils/comm-utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { verifyEmailCode } = require("./verify");
const Account = require('../models/account');
const {triggerReplaceKey} = require("./paymaster");

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
        email: req.body.email,
        status: "pending"
    });
    if (result) {
        return commUtils.retRsp(rsp, 400, "Pending recovery record already exists");
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
    var status = "pending";
    if (guardians.length === 0) {
        status = "finished";
    }

    const record = new RecoveryRecord({
        email: req.body.email,
        new_key: req.body.new_key,
        status: status,
        wallet_address: account.wallet_address, // add owner's contract wallet_address
        recovery_records: recovery_records,
        request_id: req.body.request_id
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


async function updateRecoveryRecord(req, rsp, next) {
    // TODO: validate signature
    const result = await RecoveryRecord.findOne({
        wallet_address: req.body.wallet_address,
        status: "pending"
    });
    if (!result) {
        return commUtils.retRsp(rsp, 404, "Recovery record not found");
    }

    updated = false;
    const total = result.recovery_records.length;
    const min = Math.floor(total / 2) + 1;
    var signedNum = 0;
    for (var i = 0; i < total; i++) {
        if (result.recovery_records[i].guardian_address === req.body.guardian_address) {
            // update signature
            result.recovery_records[i].signature = req.body.signature;
            updated = true;
        }
        if (result.recovery_records[i].signature) {
            signedNum ++;
        }
    }
    if (!updated) {
        return commUtils.retRsp(rsp, 400, "Guardian not in list");
    }
    if (signedNum >= min) {
        result.status = "finished";
        // TODO: call trigger pay master
        // try {
        //     const result = await triggerReplaceKey(result.wallet_address,
        //         result.new_key, result.recovery_records);
        // } catch (err) {
        //     console.log("triggerReplaceKey error:", err);
        // }
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
        new_key: req.body.new_key
    });
    if (!rrRecord) {
        return commUtils.retRsp(rsp, 404, "record not found");
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
    const requirements = {
        total: total,
        min: min,
        signedNum: signedNum
    };
    return commUtils.retRsp(rsp, 200, "Success!", {
        recoveryRecords: rrRecord,
        requirements: requirements
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
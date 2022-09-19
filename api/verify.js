var Account = require("../models/account");
const { validateEmail, sendVerifyCode } = require("../utils/email-utils");
var commUtils = require("../utils/comm-utils");
const Verification = require("../models/verification");
const config = require("../config");
const crypto = require("crypto");

const randomVerifyCode = (length = 6) => {
    const givenSet = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    var code = "";
    for (var i = 0; i < length; i++) {
        code += givenSet[crypto.randomInt(0, givenSet.length)];
    }
    return code;
}

async function verifyEmail(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "invalid email format");
    }

    // 1. send limit
    const result = await Verification.find({ email: req.body.email});
    if (result.length > config.verifyMaxResend) {
        return commUtils.retRsp(rsp, 429, "too many send of current email");
    }

    // 2. generate random code
    const code = randomVerifyCode();

    // 3. save code
    const verification = Verification({
        email: req.body.email,
        code: code,
        date: new Date()
    });
    await verification.save();

    // 4. send code
    await sendVerifyCode(req.body.email, code);

    return commUtils.retRsp(rsp, 200, "email sent", {})
}

const verifyEmailCode = async (email, code) => {
    // TODO: rate limit
    if (typeof email != 'string' || typeof code != 'string') {
        return false;
    }
    const result = await Verification.find({email: email, code: code});
    // TODO: disable magic code
    return code === "888888" || result.length > 0
}

async function verifyEmailNum(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "invalid email format");
    }

    if (typeof req.body.code !== 'string') {
        return commUtils.retRsp(rsp, 400, "empty code");
    }
    const code = req.body.code.toUpperCase();

    const result = await Verification.find({email: req.body.email, code: code});
    // TODO: set jwt
    return commUtils.retRsp(rsp, 200, "", {
        verified: code === "888888" || result.length > 0
    });
}

async function verifyEmailExists(req, rsp, next) {
  var exists = false;
  const result = await Account.find({email: req.body.email});
  if (result.length > 0) {
    exists = true;
  }
  return commUtils.retRsp(rsp, 200, "", {
    exists: exists
  });
}


module.exports = {verifyEmail, verifyEmailNum, verifyEmailExists, verifyEmailCode};
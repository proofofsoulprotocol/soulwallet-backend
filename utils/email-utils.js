const { model } = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('../config');
const assert = require('assert');

const transporter =  nodemailer.createTransport({
    pool: true,
    host: "smtp.mailgun.org",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

async function sendEmail(to, subject, content) {
    assert(validateEmail(to));
    const result = await transporter.sendMail({
        from: "no-reply@soulwallets.me",
        to: to,
        subject: subject,
        text: content
    });
    console.log(result);
}

async function sendVerifyCode(to, code) {
    const subject = `Your SoulWallet verification code is ${code}`;
    const content = `Your SoulWallet verification code is ${code}. This code will expire in ${config.verifyExpireMinutes} minutes.`;
    if (to.endsWith("@example.com")) return;
    await sendEmail(to, subject, content);
}



module.exports = {validateEmail, sendVerifyCode};

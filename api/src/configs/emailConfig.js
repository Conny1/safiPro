const nodemailer = require("nodemailer");

const emailConnect = async () => {
  // let testAccount = await nodemailer.createTestAccount();
  console.log(process.env.SMTP_USER_URL);
  let emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_USER_URL,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return emailTransporter;
};

module.exports = { emailConnect };

// utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manikanthdaru82@gmail.com",
    pass: "vshnhypsaietzwih",
  },
});

const sendMedicineEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
};

module.exports = sendMedicineEmail;

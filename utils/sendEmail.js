const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure this is called at the top

const sendConfirmationEmail = async (toEmail, studentName, courseTrack) => {
  const discordLinks = {
    "Frontend Web Development": "https://discord.gg/XQAduSGn",
    "Backend Web Development": "https://discord.gg/2awZ6vPs",
    "Illustration": "https://discord.gg/xGFG2Sgd",
    "Python": "https://discord.gg/nzEcQSVW",
    "UIUX Engineering": "https://discord.gg/FtnE45Hs",
  };

  const discordLink = discordLinks[courseTrack] || "#";

  try {
    console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD,)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"CodeCraft Forge" <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: 'Payment Confirmation - CodeCraft Forge',
      html: `
        <h2>Hi ${studentName},</h2>
        <p>🎉 Congratulations! Your payment has been successfully verified.</p>
        <p>You are now enrolled in the <strong>${courseTrack}</strong> track.</p>
        <p>Join your track community here: <a href="${discordLink}">${discordLink}</a></p>
        <br/>
        <p>Welcome aboard,<br/>CodeCraft Forge Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = sendConfirmationEmail;


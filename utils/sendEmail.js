const nodemailer = require('nodemailer');
const brevoTransport = require('nodemailer-brevo-transport');

const sendConfirmationEmail = async (toEmail, studentName, courseTrack) => {
  const discordLinks = {
    "Frontend Web Development": "https://discord.gg/XQAduSGn",
    "Backend Web Development": "https://discord.gg/2awZ6vPs",
    "Illustration": "https://discord.gg/xGFG2Sgd",
    "Python": "https://discord.gg/nzEcQSVW",
    "UIUX Engineering": "https://discord.gg/FtnE45Hs",
  };

  const discordLink = discordLinks[courseTrack];

  try {
    console.log('sending mail...');

    const transporter = nodemailer.createTransport(
      brevoTransport({
        apiKey: process.env.BREVO_API_KEY,  // From Brevo dashboard
      })
    );
    

    const mailOptions = {
      from: `"CodeCraft Forge" <${process.env.BREVO_USERNAME}>`,  // sender email from Brevo
      to: toEmail,
      subject: 'Payment Confirmation - CodeCraft Forge',
      html: `
        <h2>Hi ${studentName},</h2>
        <p>🎉 Congratulations! Your payment has been successfully verified.</p>
        <p>You are now enrolled in the <strong>${courseTrack}</strong> track.</p>
        <p>It is important you join your stack community here: <a href="${discordLink}" target="_blank">${discordLink}</a></p>
        <br />
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

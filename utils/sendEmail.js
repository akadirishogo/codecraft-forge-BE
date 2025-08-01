const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (toEmail, studentName, courseTrack) => {

    const discordLinks = {
    "Frontend Web Development": "https://discord.gg/frontend123",
    "Backend Web Development": "https://discord.gg/backend456",
    "Illustration": "https://discord.gg/illustration789",
    "Python": "https://discord.gg/python789",
    "UIUX Engineering": "https://discord.gg/uiux789",

  };

  const discordLink = discordLinks[courseTrack] || "https://discord.gg/general";

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Use your provider (Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
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
        <p>It is important you join your stack community here ${discordLink} as further information will be given there henceforth.</p>
        <br />
        <p>Welcome aboard,<br/>CodeCraft Forge Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = sendConfirmationEmail;

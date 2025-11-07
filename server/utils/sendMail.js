import transporter from "../config/email.js";

const sendEmail = async (options) => {
  const mailOptions = {
    from: `Grievance Portal <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;

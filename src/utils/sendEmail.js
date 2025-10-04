// utils/sendEmail.js
import nodemailer from "nodemailer";

// create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or your provider SMTP
  port: 587,
  secure: false, // true if port = 465
  auth: {
    user: process.env.EMAIL_USER,  // your email
    pass: process.env.EMAIL_PASS,  // app password / smtp password
  },
});

/**
 * Send Email
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.text - plain text body
 * @param {string} [options.html] - optional HTML body
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Policy Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

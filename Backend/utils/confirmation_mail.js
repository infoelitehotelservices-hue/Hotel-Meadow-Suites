import nodemailer from "nodemailer";

const createTransporter = () => nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL?.trim(),
    pass: process.env.AUTH_PASSWORD?.trim(),
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

export const sendConfirmationEmail = async (email, customerName, token) => {

  const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-booking/${token}`;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Confirm Your Booking - Meadows Hotel & Suites",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0;">Meadows Hotel &amp; Suites</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #333;">Booking Confirmation</h2>
          <p style="color: #555;">Hello <strong>${customerName}</strong>,</p>
          <p style="color: #555;">Thank you for choosing Meadows Hotel &amp; Suites. Please confirm your booking by clicking the button below.</p>
          <p style="color: #888; font-size: 13px;">This link will expire in <strong>24 hours</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmationLink}" style="background-color: #D4AF37; color: #1a1a2e; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Confirm My Booking</a>
          </div>
          <p style="color: #aaa; font-size: 12px;">If you did not make this booking, please ignore this email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 16px; text-align: center;">
          <p style="color: #aaa; font-size: 12px; margin: 0;">Meadows Hotel &amp; Suites &bull; Karachi, Pakistan &bull; info.elitehotelservices@gmail.com</p>
        </div>
      </div>
    `,
  };

  await createTransporter().sendMail(mailOptions);
};
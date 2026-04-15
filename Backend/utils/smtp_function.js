import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL?.trim(),
    pass: process.env.AUTH_PASSWORD?.trim(),
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

const otpBox = (otp) =>
  `<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr>
      ${otp.toString().split('').map(d =>
        `<td style="width:52px;height:60px;background:#ffffff;border:2px solid #D4AF37;
          border-radius:6px;text-align:center;vertical-align:middle;
          font-size:30px;font-weight:bold;color:#1a1a2e;
          font-family:'Courier New',monospace;box-shadow:0 2px 8px rgba(212,175,55,0.3);">${d}</td>`
      ).join('<td style="width:8px;"></td>')}
    </tr>
  </table>`;

export async function sendVerificationEmail(userEmail, otp) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:48px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#12122a;border-radius:4px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6);">

        <!-- Top accent bar -->
        <tr>
          <td style="background:linear-gradient(90deg,#b8960c,#D4AF37,#f0d060,#D4AF37,#b8960c);height:4px;"></td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:48px 48px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td style="width:60px;height:60px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.4);border-radius:50%;text-align:center;vertical-align:middle;font-size:26px;">
                  ✉️
                </td>
              </tr>
            </table>
            <h1 style="margin:0 0 6px;color:#D4AF37;font-size:13px;letter-spacing:5px;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:400;">
              Meadows Hotel &amp; Suites
            </h1>
            <div style="width:40px;height:1px;background:#D4AF37;margin:12px auto;opacity:0.5;"></div>
            <h2 style="margin:0;color:#ffffff;font-size:26px;font-family:'Georgia',serif;font-weight:400;letter-spacing:1px;">
              Verify Your Account
            </h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:0 48px 40px;text-align:center;">
            <p style="margin:0 0 32px;color:#9aa5b8;font-size:15px;line-height:1.9;font-family:Arial,sans-serif;">
              Welcome to Meadows Hotel &amp; Suites. To complete your<br/>registration, please use the verification code below.
            </p>

            <!-- OTP -->
            <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:32px 24px;margin-bottom:32px;">
              <p style="margin:0 0 16px;color:#D4AF37;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">
                Your Verification Code
              </p>
              ${otpBox(otp)}
            </div>

            <p style="margin:0 0 8px;color:#9aa5b8;font-size:13px;font-family:Arial,sans-serif;">
              Enter this code on the verification page to activate your account.
            </p>
            <p style="margin:0;color:#e74c3c;font-size:13px;font-family:Arial,sans-serif;">
              ⏱ This code expires in <strong style="color:#e74c3c;">10 minutes</strong>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 48px;">
            <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 48px;text-align:center;">
            <p style="margin:0 0 6px;color:#4a5568;font-size:12px;font-family:Arial,sans-serif;">
              If you did not create an account, please ignore this email.
            </p>
            <p style="margin:0;color:#2d3748;font-size:11px;font-family:Arial,sans-serif;">
              &copy; ${new Date().getFullYear()} Meadows Hotel &amp; Suites &bull; Karachi, Pakistan
            </p>
          </td>
        </tr>

        <!-- Bottom accent bar -->
        <tr>
          <td style="background:linear-gradient(90deg,#b8960c,#D4AF37,#f0d060,#D4AF37,#b8960c);height:4px;"></td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await createTransporter().sendMail({
      from: `"Meadows Hotel & Suites" <${process.env.AUTH_EMAIL?.trim()}>`,
      to: userEmail,
      subject: 'Verify Your Account – Meadows Hotel & Suites',
      html,
    });
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Verification email failed:', error.message);
    throw error;
  }
}

export async function sendForgotPasswordEmail(userEmail, otp) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:48px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.1);">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:48px 48px 36px;text-align:center;">
            <!-- Gold ornament line -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="width:30px;height:1px;background:#D4AF37;vertical-align:middle;"></td>
                <td style="padding:0 12px;color:#D4AF37;font-size:18px;vertical-align:middle;">✦</td>
                <td style="width:30px;height:1px;background:#D4AF37;vertical-align:middle;"></td>
              </tr>
            </table>
            <h1 style="margin:0 0 4px;color:#D4AF37;font-size:20px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:400;">
              Meadows Hotel &amp; Suites
            </h1>
            <p style="margin:8px 0 0;color:#6b7a99;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">
              Password Recovery
            </p>
          </td>
        </tr>

        <!-- Amber alert bar -->
        <tr>
          <td style="background:#D4AF37;padding:14px 48px;text-align:center;">
            <p style="margin:0;color:#1a1a2e;font-size:13px;font-weight:bold;letter-spacing:1px;font-family:Arial,sans-serif;">
              🔒 &nbsp; SECURITY NOTIFICATION &nbsp; 🔒
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px;text-align:center;">
            <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:24px;font-family:'Georgia',serif;font-weight:400;">
              Reset Your Password
            </h2>
            <p style="margin:0 0 36px;color:#666;font-size:15px;line-height:1.9;font-family:Arial,sans-serif;max-width:400px;margin-left:auto;margin-right:auto;">
              We received a request to reset the password for your account.
              Use the code below to proceed. If you did not make this request,
              you can safely ignore this email.
            </p>

            <!-- OTP box -->
            <div style="background:#faf8f3;border:1px solid #e8dfc8;border-radius:8px;padding:36px 24px;margin-bottom:32px;position:relative;">
              <p style="margin:0 0 20px;color:#b8960c;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">
                Password Reset Code
              </p>
              ${otpBox(otp)}
              <p style="margin:20px 0 0;color:#999;font-size:12px;font-family:Arial,sans-serif;">
                Enter this code on the password reset page
              </p>
            </div>

            <p style="margin:0 0 8px;color:#e74c3c;font-size:13px;font-family:Arial,sans-serif;">
              ⏱ Expires in <strong>10 minutes</strong>
            </p>

            <!-- Security warning box -->
            <div style="background:#fff8f8;border-left:3px solid #e74c3c;padding:14px 20px;margin-top:28px;text-align:left;border-radius:0 4px 4px 0;">
              <p style="margin:0;color:#c0392b;font-size:12px;font-family:Arial,sans-serif;line-height:1.7;">
                <strong>Security tip:</strong> Meadows Hotel &amp; Suites will never ask you to share this code.
                If you did not request a password reset, please secure your account immediately.
              </p>
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 48px;">
            <div style="height:1px;background:#f0ece3;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf8f3;padding:28px 48px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
              <tr>
                <td style="width:20px;height:1px;background:#D4AF37;vertical-align:middle;"></td>
                <td style="padding:0 8px;color:#D4AF37;font-size:12px;vertical-align:middle;">✦</td>
                <td style="width:20px;height:1px;background:#D4AF37;vertical-align:middle;"></td>
              </tr>
            </table>
            <p style="margin:0 0 4px;color:#aaa;font-size:12px;font-family:Arial,sans-serif;">
              &copy; ${new Date().getFullYear()} Meadows Hotel &amp; Suites &bull; Karachi, Pakistan
            </p>
            <p style="margin:0;color:#ccc;font-size:11px;font-family:Arial,sans-serif;">
              info.elitehotelservices@gmail.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await createTransporter().sendMail({
      from: `"Meadows Hotel & Suites" <${process.env.AUTH_EMAIL?.trim()}>`,
      to: userEmail,
      subject: 'Password Reset Request – Meadows Hotel & Suites',
      html,
    });
    console.log('Forgot password email sent successfully');
  } catch (error) {
    console.error('Forgot password email failed:', error.message);
    throw error;
  }
}

// Backward-compatible default export (used by authController for registration)
export default sendVerificationEmail;

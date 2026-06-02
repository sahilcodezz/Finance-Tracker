const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail Connection Failed:", error.message);
  } else {
    console.log("✅ Gmail Connected Successfully");
  }
});

const sendOTP = async (email, otp) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #3b82f6; text-align: center;">Finance Tracker - OTP Verification</h2>
        <div style="background-color: #3b82f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #fff; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">⏱️ Valid for 5 minutes</p>
      </div>
    `;

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📧 OTP EMAIL DETAILS`);
    console.log(`${'='.repeat(50)}`);
    console.log(`TO: ${email}`);
    console.log(`OTP CODE: ${otp}`);
    console.log(`EXPIRES IN: 5 minutes`);
    console.log(`${'='.repeat(50)}\n`);

    const mailOptions = {
      from: `"Finance Tracker" <${process.env.EMAIL}>`,
      to: email,
      subject: `🔐 Your Finance Tracker OTP: ${otp}`,
      html: htmlTemplate,
      text: `Your OTP: ${otp} (expires in 5 minutes)`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    return { success: true };

  } catch (error) {
    console.error("\n❌ EMAIL ERROR:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("See details above ^\n");
    
    // For testing: show OTP in console even if email fails
    console.log(`⚠️  CHECK CONSOLE FOR OTP: ${error.message.includes('getaddrinfo') ? 'Network Issue' : 'Auth Issue'}`);
    return { success: false };
  }
};

module.exports = sendOTP;
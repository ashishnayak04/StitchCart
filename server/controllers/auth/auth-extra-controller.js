const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../middleware/auth-middleware");
const { transporter } = require("../../helpers/mailer");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Forgot password - sends reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: `"StitchCart" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Password Reset Request - StitchCart",
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0;">Reset Password</a>
            <p style="color:#666;font-size:13px;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
          </div>`,
        });
      }
      res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (mailErr) {
      console.log("Mail error:", mailErr);
      res.status(200).json({ success: true, message: "Password reset token generated" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

// Send email verification
const sendEmailVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const verifyUrl = `${CLIENT_URL}/auth/verify-email?token=${verifyToken}`;

    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: `"StitchCart" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Verify Your Email - StitchCart",
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2>Email Verification</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0;">Verify Email</a>
            <p style="color:#666;font-size:13px;">This link expires in 24 hours.</p>
          </div>`,
        });
      }
      res.status(200).json({ success: true, message: "Verification email sent" });
    } catch (mailErr) {
      console.log("Mail error:", mailErr);
      res.status(200).json({ success: true, message: "Verification token generated" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error sending verification" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error verifying email" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { userId, userName, phone, avatar } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userName) user.userName = userName;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// Google OAuth login/register
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = new User({
        userName: name || email.split("@")[0],
        email,
        password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 12),
        googleId,
        avatar: avatar || "",
        isEmailVerified: true,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: { email: user.email, role: user.role, id: user._id, userName: user.userName, avatar: user.avatar },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Google auth error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  updateProfile,
  googleAuth,
};

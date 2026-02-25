const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const User = require("../models/User");
const User = require("../models/user");
const { signToken } = require("../middleware/auth");

const router = express.Router();

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp) {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || "otp_secret";
  return crypto.createHmac("sha256", secret).update(String(otp)).digest("hex");
}

async function sendOtpEmail({ to, otp }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error("SMTP credentials are missing (SMTP_USER/SMTP_PASS)");
  }

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: { user, pass },
  });

  const from = process.env.SMTP_FROM || user;
  const appName = process.env.APP_NAME || "BusGo";

  await transporter.sendMail({
    from,
    to,
    subject: `${appName} OTP for Login`,
    text: `Your OTP for ${appName} login is: ${otp}. It will expire in 10 minutes.`,
  });
}

// 📝 Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    let userRole = "customer";
    if (role === "admin") {
      const requiredKey = (process.env.ADMIN_SIGNUP_KEY || "").trim();
      const providedKey = (adminKey || "").trim();
      if (!requiredKey) {
        return res.status(500).json({
          message: "ADMIN_SIGNUP_KEY is not set on the server. Please configure backend .env and restart the server.",
        });
      }
      if (!providedKey || providedKey !== requiredKey) {
        return res.status(403).json({ message: "Invalid admin signup key" });
      }
      userRole = "admin";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      emailVerified: false,
    });

    const otp = makeOtp();
    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOtpEmail({ to: email, otp });
    } catch (mailErr) {
      console.error("OTP Email Error:", mailErr);
      return res.status(500).json({
        message:
          "Account created but OTP email failed. Please configure SMTP (SMTP_USER/SMTP_PASS) and use 'Resend OTP'.",
      });
    }

    if (userRole === "admin") {
      res.status(201).json({ message: "Admin created. OTP sent to email for verification.", user });
    } else {
      res.status(201).json({ message: "Account created. OTP sent to email for verification.", user });
    }
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Temporarily allow login without email verification for demo
    // if (!user.emailVerified) {
    //   return res.status(403).json({
    //     message: "Email not verified. Please verify OTP from signup.",
    //   });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✉️ OTP: Send OTP to email (resend for signup verification)
router.post("/send-otp", async (req, res) => {
  try {
    const { email, name, role } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found. Please signup first." });

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (role === "admin" && user.role !== "admin") {
      return res.status(403).json({ message: "This email is not registered as Admin." });
    }

    const otp = makeOtp();
    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOtpEmail({ to: email, otp });
    } catch (mailErr) {
      console.error("OTP Email Error:", mailErr);
      return res.status(500).json({
        message:
          "OTP email failed. Please configure SMTP (SMTP_USER/SMTP_PASS) in backend .env and restart server.",
      });
    }

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ OTP: Verify OTP (Email) and issue JWT
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP not requested. Please request a new OTP." });
    }
    if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return res.status(401).json({ message: "OTP expired. Please request a new OTP." });
    }

    const otpHash = hashOtp(otp);
    if (otpHash !== user.otpHash) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.emailVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = signToken(user);
    return res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
// const User = require("../models/User");
const User = require("../models/user");
const { signToken } = require("../middleware/auth");

const router = express.Router();

// 📝 Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    let userRole = "client";
    if (role === "admin") {
      const requiredKey = process.env.ADMIN_SIGNUP_KEY;
      if (!requiredKey || adminKey !== requiredKey) {
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
    });

    const token = signToken(user);
    if (userRole === "admin") {
      res.status(201).json({ message: "Admin user created successfully", token, user });
    } else {
      res.status(201).json({ message: "User created successfully", token, user });
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

module.exports = router;

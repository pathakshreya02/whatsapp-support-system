const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Incoming:", req.body); // ✅ debug

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(200).json({ message: "User created successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const signin = require("../models/signupSchema");

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await signin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Successful login
    res.status(200).json({
      user_id: user._id,
      message: "Login successful",
    });

  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

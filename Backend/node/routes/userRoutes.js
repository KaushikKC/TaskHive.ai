// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user profile
router.post("/create", async (req, res) => {
  try {
    const { walletAddress, nickname, preferences } = req.body;
    const user = new User({
      walletAddress,
      nickname,
      preferences,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get("/:walletAddress", async (req, res) => {
  try {
    const user = await User.findOne({
      walletAddress: req.params.walletAddress,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user preferences
router.put("/:walletAddress", async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findOneAndUpdate(
      { walletAddress: req.params.walletAddress },
      { preferences },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: String,
  preferences: {
    maxBudget: Number,
    minRarity: Number,
    favoriteCategories: [String],
    autoBuyEnabled: Boolean,
    autoRelistEnabled: Boolean,
    relistMarkup: Number,
  },
  reputation: {
    score: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

// src/models/NFT.js
const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  metadataUri: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
  price: Number,
  seller: String,
  owner: String,
  isListed: Boolean,
  listingId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NFT", nftSchema);

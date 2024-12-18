// src/routes/nftRoutes.js
const express = require("express");
const router = express.Router();
const NFT = require("../models/NFT");
const { web3 } = require("../utils/solana");

// List NFT
router.post("/list", async (req, res) => {
  try {
    const { metadataUri, name, description, price, seller } = req.body;
    const nft = new NFT({
      metadataUri,
      name,
      description,
      price,
      seller,
      isListed: true,
    });
    await nft.save();
    res.status(201).json(nft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all listings
router.get("/listings", async (req, res) => {
  try {
    const listings = await NFT.find({ isListed: true });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get NFT by ID
router.get("/:id", async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

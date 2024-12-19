// routes/agentRoutes.ts
const express = require("express");
const { Connection, PublicKey } = require("@solana/web3.js");
const { AnchorProvider, Program, Idl } = require("@project-serum/anchor");
const { AgentManager } = require("../agents/AgentManager");
const { IDL } = require("../IDL/nft_marketplace");

const router = express.Router();

if (!process.env.SOLANA_RPC_URL) {
  throw new Error("SOLANA_RPC_URL is not defined in environment variables");
}
// Initialize Solana connection and program (you'll need to configure these)
const connection = new Connection(process.env.SOLANA_RPC_URL);

const dummyWallet = {
  publicKey: new PublicKey("11111111111111111111111111111111"),
  signTransaction: async () => {
    throw new Error("Not implemented");
  },
  signAllTransactions: async () => {
    throw new Error("Not implemented");
  },
};

// Initialize provider
const provider = new AnchorProvider(
  connection,
  dummyWallet,
  AnchorProvider.defaultOptions()
);
// You need to add your program's IDL
const programId = new PublicKey(process.env.PROGRAM_ID);
const program = new Program(IDL, programId, provider);

// Create a single instance of AgentManager
const agentManager = new AgentManager(connection, program);

// Get AI recommendations
router.get("/recommendation/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const agent = agentManager.getAgent(walletAddress);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const listings = await agent.fetchActiveListings();
    const recommendations = agent.filterAndRankListings(listings);

    res.json({
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      userPreferences: agent.userPreferences,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger AI purchase
router.post("/buy", async (req, res) => {
  try {
    const { walletAddress, nftId } = req.body;
    const agent = agentManager.getAgent(walletAddress);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const listings = await agent.fetchActiveListings();
    const nft = listings.find((listing) => listing.listingId === nftId);

    if (!nft) {
      return res.status(404).json({ error: "NFT listing not found" });
    }

    if (agent.shouldPurchase(nft)) {
      await agent.executePurchase(nft);
      res.json({ message: "Purchase executed successfully" });
    } else {
      res.status(400).json({ error: "Purchase criteria not met" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger AI relisting
router.post("/relist", async (req, res) => {
  try {
    const { walletAddress, nftMint } = req.body;
    const agent = agentManager.getAgent(walletAddress);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const ownedNFTs = await agent.fetchUserNFTs();
    const nft = ownedNFTs.find((n) => n.mint === nftMint);

    if (!nft) {
      return res.status(404).json({ error: "NFT not found in user's wallet" });
    }

    if (agent.shouldRelist(nft)) {
      await agent.executeRelist(nft);
      res.json({ message: "Relist executed successfully" });
    } else {
      res.status(400).json({ error: "Relist criteria not met" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new agent for a user
router.post("/create", async (req, res) => {
  try {
    const { walletAddress, preferences } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    await agentManager.createAgent(walletAddress, {
      maxBudget: preferences.maxBudget,
      minRarity: preferences.minRarity,
      autoRelistEnabled: preferences.autoRelistEnabled,
      ...preferences,
    });

    res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop an agent
router.post("/stop", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    agentManager.stopAgent(walletAddress);
    res.json({ message: "Agent stopped successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent status
router.get("/status/:walletAddress", (req, res) => {
  try {
    const { walletAddress } = req.params;
    const agent = agentManager.getAgent(walletAddress);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json({
      status: "active",
      agent: agent.userPreferences, // You might want to add a method to get agent status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update agent preferences
router.put("/preferences", async (req, res) => {
  try {
    const { walletAddress, preferences } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // Stop existing agent
    agentManager.stopAgent(walletAddress);

    // Create new agent with updated preferences
    await agentManager.createAgent(walletAddress, preferences);

    res.json({ message: "Agent preferences updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

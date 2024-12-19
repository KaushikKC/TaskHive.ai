// routes/transactionRoutes.js
const express = require("express");
const { Connection, PublicKey } = require("@solana/web3.js");
const router = express.Router();

// Get transaction history for a wallet
router.get("/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL);
    const pubKey = new PublicKey(walletAddress);

    // Fetch recent transactions
    const transactions = await connection.getSignaturesForAddress(
      pubKey,
      { limit: 20 } // Fetch last 20 transactions
    );

    // Get detailed transaction info
    const transactionDetails = await Promise.all(
      transactions.map(async (tx) => {
        const details = await connection.getTransaction(tx.signature);
        return {
          signature: tx.signature,
          timestamp: tx.blockTime,
          status: tx.confirmationStatus,
          slot: tx.slot,
          details: details
            ? {
                fee: details.meta?.fee,
                type: details.transaction.message.instructions[0]?.programId.toString(),
              }
            : null,
        };
      })
    );

    res.json({
      wallet: walletAddress,
      transactions: transactionDetails,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

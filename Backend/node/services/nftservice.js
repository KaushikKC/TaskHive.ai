const axios = require("axios");

const fetchNFTs = async (collection, maxPrice) => {
  try {
    const response = await axios.get(
      `https://api.magiceden.io/nfts?collection=${collection}`
    );
    const nfts = response.data.filter((nft) => nft.price <= maxPrice);
    return nfts.map((nft) => ({
      id: nft.id,
      name: nft.name,
      price: nft.price,
      collection: nft.collection,
      image: nft.image,
    }));
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw new Error("Failed to fetch NFTs");
  }
};

const executeNFTPurchase = async (userId, nftId, userWallet) => {
  try {
    // Validate purchase with AI agent
    const aiValidation = await axios.post(
      `${process.env.AI_AGENT_URL}/validate-nft-purchase`,
      { userId, nftId }
    );

    if (!aiValidation.data.isValid) {
      throw new Error(aiValidation.data.reason);
    }

    // Execute Solana transaction
    const transaction = await createNFTPurchaseTransaction(nftId, userWallet);
    const result = await web3.sendAndConfirmTransaction(transaction);

    // Log transaction for AI learning
    await axios.post(`${process.env.AI_AGENT_URL}/log-transaction`, {
      type: "NFT_PURCHASE",
      userId,
      nftId,
      transaction: result,
    });

    return {
      status: "success",
      transactionId: result,
      message: `NFT ${nftId} purchased by user ${userId}`,
    };
  } catch (error) {
    console.error("Error executing NFT purchase:", error);
    throw new Error("Failed to purchase NFT");
  }
};

module.exports = { fetchNFTs, executeNFTPurchase };

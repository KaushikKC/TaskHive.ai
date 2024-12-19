// src/agent/AIAgent.ts
const {
  Connection,
  PublicKey,
  VersionedTransaction,
  Transaction,
} = require("@solana/web3.js");
const { Program } = require("@project-serum/anchor");
const bs58 = require("bs58");

class AIAgent {
  constructor(connection, program, userPreferences) {
    this.connection = connection;
    this.program = program;
    this.userPreferences = userPreferences;
  }

  // Main agent loop
  async start() {
    while (true) {
      try {
        await this.checkAndProcessListings();
        await this.checkAndProcessRelisting();
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
      } catch (error) {
        console.error("Agent error:", error);
      }
    }
  }

  // Check listings and make purchase decisions
  async checkAndProcessListings() {
    const listings = await this.fetchActiveListings();
    const recommendations = this.filterAndRankListings(listings);

    for (const nft of recommendations) {
      if (this.shouldPurchase(nft)) {
        await this.executePurchase(nft);
      }
    }
  }

  // Filter and rank NFTs based on user preferences
  filterAndRankListings(listings) {
    return listings
      .filter((nft) => {
        return (
          nft.price <= this.userPreferences.maxBudget &&
          this.calculateRarityScore(nft) >= this.userPreferences.minRarity &&
          this.matchesUserCategories(nft)
        );
      })
      .sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
  }

  // Calculate NFT score based on various factors
  calculateScore(nft) {
    const rarityScore = this.calculateRarityScore(nft);
    const priceScore = this.calculatePriceScore(nft);
    const categoryScore = this.calculateCategoryScore(nft);

    return rarityScore * 0.4 + priceScore * 0.3 + categoryScore * 0.3;
  }

  // Execute NFT purchase
  async executePurchase(nft) {
    try {
      const tx = await this.program.methods
        .purchaseNFT(nft.listingId)
        .accounts({
          buyer: this.userPreferences.walletAddress,
          seller: nft.seller,
          nft: nft.mint,
        })
        .transaction();

      // Convert Transaction to VersionedTransaction
      const latestBlockhash = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;

      // Create VersionedTransaction from message
      const versionedTx = new VersionedTransaction(
        tx.compileMessage() // Convert the legacy transaction message
      );

      const signature = await this.connection.sendTransaction(versionedTx);
      console.log("Purchase successful:", signature);

      await this.updateUserGraph(nft, "purchase");
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  }

  // Check and process NFT relisting
  async checkAndProcessRelisting() {
    if (!this.userPreferences.autoRelistEnabled) return;

    const ownedNFTs = await this.fetchUserNFTs();

    for (const nft of ownedNFTs) {
      if (this.shouldRelist(nft)) {
        await this.executeRelist(nft);
      }
    }
  }

  // Update executeRelist to use VersionedTransaction
  async executeRelist(nft) {
    const newPrice = this.calculateRelistPrice(nft);

    try {
      const tx = await this.program.methods
        .relistNFT(nft.mint, newPrice)
        .accounts({
          owner: this.userPreferences.walletAddress,
          nft: nft.mint,
        })
        .transaction();

      // Convert Transaction to VersionedTransaction
      const latestBlockhash = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;

      // Create VersionedTransaction from message
      const versionedTx = new VersionedTransaction(
        tx.compileMessage() // Convert the legacy transaction message
      );

      const signature = await this.connection.sendTransaction(versionedTx);
      console.log("Relist successful:", signature);

      await this.updateUserGraph(nft, "relist");
    } catch (error) {
      console.error("Relist failed:", error);
    }
  }

  // Update user's on-chain graph
  async updateUserGraph(nft, action) {
    try {
      await this.program.methods
        .updateUserIdentity(action)
        .accounts({
          user: this.userPreferences.walletAddress,
        })
        .rpc();
    } catch (error) {
      console.error("Failed to update user graph:", error);
    }
  }

  calculateRarityScore(nft) {
    // Implement rarity calculation logic
    const traits = nft.attributes || [];
    const rarityScore = traits.reduce((score, trait) => {
      // Calculate based on trait rarity
      const traitRarity = trait.rarity || 0;
      return score + traitRarity;
    }, 0);

    return rarityScore;
  }

  shouldPurchase(nft) {
    const score = this.calculateScore(nft);
    const isWithinBudget = nft.price <= this.userPreferences.maxBudget;
    const meetsRarityThreshold =
      this.calculateRarityScore(nft) >= this.userPreferences.minRarity;
    const potentialProfit = this.estimatePotentialProfit(nft);

    return (
      isWithinBudget &&
      meetsRarityThreshold &&
      potentialProfit >= this.userPreferences.minProfitTarget
    );
  }

  // Add calculateRelistPrice method
  calculateRelistPrice(nft) {
    const purchasePrice = nft.purchasePrice || 0;
    const marketFloor = nft.collectionFloorPrice || 0;
    const profitMargin = this.userPreferences.targetProfitMargin || 0.2;

    return Math.max(
      purchasePrice * (1 + profitMargin),
      marketFloor * 0.95 // Slightly below floor price
    );
  }

  async fetchUserNFTs() {
    try {
      // Fetch user's NFTs from their wallet
      const nfts = await this.program.account.nftAccount.all([
        {
          memcmp: {
            offset: 8,
            bytes: this.userPreferences.walletAddress,
          },
        },
      ]);

      return nfts.map((nft) => nft.account);
    } catch (error) {
      console.error("Error fetching user NFTs:", error);
      return [];
    }
  }

  // Add helper method for profit estimation
  estimatePotentialProfit(nft) {
    const estimatedSalePrice = this.calculateRelistPrice(nft);
    const purchasePrice = nft.price;
    return ((estimatedSalePrice - purchasePrice) / purchasePrice) * 100;
  }

  shouldRelist(nft) {
    // Implement relisting decision logic
    const holdingTime = Date.now() - nft.purchaseTimestamp;
    const priceIncrease = this.calculatePriceIncrease(nft);

    return (
      holdingTime > this.userPreferences.minHoldTime &&
      priceIncrease >= this.userPreferences.minProfitMargin
    );
  }

  calculatePriceScore(nft) {
    // Implement price scoring logic
    const floorPrice = nft.collectionFloorPrice || 0;
    const listingPrice = nft.price || 0;

    return (floorPrice - listingPrice) / floorPrice;
  }

  calculateCategoryScore(nft) {
    // Implement category scoring logic
    const userCategories = new Set(this.userPreferences.preferredCategories);
    const nftCategories = nft.categories || [];

    const matchingCategories = nftCategories.filter((category) =>
      userCategories.has(category)
    );

    return matchingCategories.length / userCategories.size;
  }

  matchesUserCategories(nft) {
    const userCategories = new Set(this.userPreferences.preferredCategories);
    const nftCategories = nft.categories || [];

    return nftCategories.some((category) => userCategories.has(category));
  }

  calculatePriceIncrease(nft) {
    const currentPrice = nft.currentPrice || 0;
    const purchasePrice = nft.purchasePrice || 0;

    return ((currentPrice - purchasePrice) / purchasePrice) * 100;
  }

  async fetchActiveListings() {
    try {
      const listings = await this.program.account.listingAccount.all([
        {
          memcmp: {
            offset: 8,
            bytes: bs58.encode(Buffer.from([1])), // Convert Buffer to base58 string
          },
        },
      ]);

      return listings.map((listing) => listing.account);
    } catch (error) {
      console.error("Error fetching active listings:", error);
      return [];
    }
  }
}

module.exports = { AIAgent };

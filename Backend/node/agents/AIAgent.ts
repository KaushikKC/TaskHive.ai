// src/agent/AIAgent.ts
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";

export class AIAgent {
  private connection: Connection;
  private program: Program;
  private userPreferences: any;

  constructor(connection: Connection, program: Program, userPreferences: any) {
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
  private filterAndRankListings(listings: any[]) {
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
  private calculateScore(nft: any): number {
    const rarityScore = this.calculateRarityScore(nft);
    const priceScore = this.calculatePriceScore(nft);
    const categoryScore = this.calculateCategoryScore(nft);

    return rarityScore * 0.4 + priceScore * 0.3 + categoryScore * 0.3;
  }

  // Execute NFT purchase
  private async executePurchase(nft: any) {
    try {
      const tx = await this.program.methods
        .purchaseNFT(nft.listingId)
        .accounts({
          buyer: this.userPreferences.walletAddress,
          seller: nft.seller,
          nft: nft.mint,
        })
        .transaction();

      const signature = await this.connection.sendTransaction(tx);
      console.log("Purchase successful:", signature);

      await this.updateUserGraph(nft, "purchase");
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  }

  // Check and process NFT relisting
  private async checkAndProcessRelisting() {
    if (!this.userPreferences.autoRelistEnabled) return;

    const ownedNFTs = await this.fetchUserNFTs();

    for (const nft of ownedNFTs) {
      if (this.shouldRelist(nft)) {
        await this.executeRelist(nft);
      }
    }
  }

  // Execute NFT relisting
  private async executeRelist(nft: any) {
    const newPrice = this.calculateRelistPrice(nft);

    try {
      const tx = await this.program.methods
        .relistNFT(nft.mint, newPrice)
        .accounts({
          owner: this.userPreferences.walletAddress,
          nft: nft.mint,
        })
        .transaction();

      const signature = await this.connection.sendTransaction(tx);
      console.log("Relist successful:", signature);

      await this.updateUserGraph(nft, "relist");
    } catch (error) {
      console.error("Relist failed:", error);
    }
  }

  // Update user's on-chain graph
  private async updateUserGraph(nft: any, action: string) {
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
}

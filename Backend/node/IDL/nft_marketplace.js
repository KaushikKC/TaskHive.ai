// backend/src/idl/nft_marketplace.ts

const IDL = {
  version: "0.1.0",
  name: "nft_marketplace",
  instructions: [
    {
      name: "initializeMarketplace",
      accounts: [
        { name: "marketplace", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "mintNft",
      accounts: [
        { name: "payer", isMut: true, isSigner: true },
        { name: "mint", isMut: true, isSigner: true },
        { name: "tokenAccount", isMut: true, isSigner: false },
        { name: "metadata", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "tokenMetadataProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "uri", type: "string" },
      ],
    },
    {
      name: "listNft",
      accounts: [
        { name: "marketplace", isMut: true, isSigner: false },
        { name: "listing", isMut: true, isSigner: false },
        { name: "nftMint", isMut: false, isSigner: false },
        { name: "seller", isMut: true, isSigner: true },
        { name: "userIdentity", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "price", type: "u64" },
        { name: "metadataUri", type: "string" },
      ],
    },
    {
      name: "purchaseNft",
      accounts: [
        { name: "listing", isMut: true, isSigner: false },
        { name: "buyer", isMut: true, isSigner: true },
        { name: "seller", isMut: true, isSigner: false },
        { name: "sellerTokenAccount", isMut: true, isSigner: false },
        { name: "buyerTokenAccount", isMut: true, isSigner: false },
        { name: "userIdentity", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Marketplace",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "totalListings", type: "u64" },
        ],
      },
    },
    {
      name: "NFTListing",
      type: {
        kind: "struct",
        fields: [
          { name: "seller", type: "publicKey" },
          { name: "nftMint", type: "publicKey" },
          { name: "price", type: "u64" },
          { name: "metadataUri", type: "string" },
          { name: "isActive", type: "bool" },
        ],
      },
    },
    {
      name: "UserIdentity",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "reputationScore", type: "u64" },
          { name: "totalPurchases", type: "u64" },
          { name: "totalListings", type: "u64" },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: "ListingNotActive", msg: "Listing is not active" },
    { code: 6001, name: "InvalidPrice", msg: "Invalid listing price" },
    {
      code: 6002,
      name: "InsufficientFunds",
      msg: "Insufficient funds for purchase",
    },
    { code: 6003, name: "Overflow", msg: "Arithmetic overflow" },
  ],
};

module.exports = { IDL };

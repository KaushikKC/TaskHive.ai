// backend/src/idl/nft_marketplace.ts

export const IDL = {
  version: "0.1.0",
  name: "nft_marketplace",
  instructions: [
    {
      name: "initializeMarketplace",
      accounts: [
        {
          name: "marketplace",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "listNft",
      accounts: [
        {
          name: "marketplace",
          isMut: true,
          isSigner: false,
        },
        {
          name: "listing",
          isMut: true,
          isSigner: true,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "metadataUri",
          type: "string",
        },
        {
          name: "price",
          type: "u64",
        },
      ],
    },
    {
      name: "purchaseNft",
      accounts: [
        {
          name: "listing",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "seller",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sellerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buyerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "updateUserIdentity",
      accounts: [
        {
          name: "userIdentity",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "action",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Marketplace",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "totalListings",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "NFTListing",
      type: {
        kind: "struct",
        fields: [
          {
            name: "seller",
            type: "publicKey",
          },
          {
            name: "nftMint",
            type: "publicKey",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "metadataUri",
            type: "string",
          },
          {
            name: "isActive",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "UserIdentity",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey",
          },
          {
            name: "reputationScore",
            type: "u64",
          },
          {
            name: "totalPurchases",
            type: "u64",
          },
          {
            name: "totalListings",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "ListingNotActive",
      msg: "Listing is not active",
    },
  ],
};

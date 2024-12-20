const express = require("express");
const router = express.Router();
const NFT = require("../models/NFT");
const {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
} = require("@solana/web3.js");
const { Program, AnchorProvider, BN } = require("@project-serum/anchor");
const {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} = require("@solana/spl-token");
const { IDL } = require("../IDL/nft_marketplace");

const connection = new Connection(process.env.SOLANA_RPC_URL);
const programId = new PublicKey(process.env.PROGRAM_ID);

// Initialize marketplace
router.post("/initialize", async (req, res) => {
  try {
    const authority = Keypair.generate();
    const [marketplacePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace")],
      programId
    );

    const tx = await program.methods
      .initializeMarketplace()
      .accounts({
        marketplace: marketplacePDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    res.status(201).json({
      signature: tx,
      marketplaceAddress: marketplacePDA.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint NFT
router.post("/mint", async (req, res) => {
  try {
    const { name, symbol, uri, payer } = req.body;

    const mint = Keypair.generate();
    const payerPubkey = new PublicKey(payer);

    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      payerPubkey
    );

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      programId
    );

    const tx = await program.methods
      .mintNft(name, symbol, uri)
      .accounts({
        payer: payerPubkey,
        mint: mint.publicKey,
        tokenAccount,
        metadata: metadataPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

    const nft = new NFT({
      name,
      symbol,
      uri,
      mint: mint.publicKey.toString(),
      owner: payer,
      isListed: false,
    });
    await nft.save();

    res.status(201).json({
      signature: tx,
      mint: mint.publicKey.toString(),
      nft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List NFT
router.post("/list", async (req, res) => {
  try {
    const { price, metadataUri, nftMint, seller } = req.body;

    const [marketplacePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace")],
      programId
    );

    const [listingPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("listing"), new PublicKey(nftMint).toBuffer()],
      programId
    );

    const [userIdentityPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_identity"), new PublicKey(seller).toBuffer()],
      programId
    );

    const tx = await program.methods
      .listNft(new BN(price), metadataUri)
      .accounts({
        marketplace: marketplacePDA,
        listing: listingPDA,
        nftMint: new PublicKey(nftMint),
        seller: new PublicKey(seller),
        userIdentity: userIdentityPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await NFT.findOneAndUpdate(
      { mint: nftMint },
      { isListed: true, price, listingAddress: listingPDA.toString() }
    );

    res.status(201).json({
      signature: tx,
      listingAddress: listingPDA.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase NFT
router.post("/purchase", async (req, res) => {
  try {
    const { listing, buyer, seller, nftMint } = req.body;

    const buyerPubkey = new PublicKey(buyer);
    const sellerPubkey = new PublicKey(seller);
    const mintPubkey = new PublicKey(nftMint);

    const sellerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      sellerPubkey
    );

    const buyerTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      buyerPubkey
    );

    const [userIdentityPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_identity"), buyerPubkey.toBuffer()],
      programId
    );

    const tx = await program.methods
      .purchaseNft()
      .accounts({
        listing: new PublicKey(listing),
        buyer: buyerPubkey,
        seller: sellerPubkey,
        sellerTokenAccount,
        buyerTokenAccount,
        userIdentity: userIdentityPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await NFT.findOneAndUpdate(
      { mint: nftMint },
      { isListed: false, owner: buyer }
    );

    res.json({
      signature: tx,
      message: "NFT purchased successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all listings
router.get("/listings", async (req, res) => {
  try {
    const listings = await program.account.nftListing.all([
      {
        memcmp: {
          offset: 8 + 32 + 32 + 8 + 200,
          bytes: bs58.encode(Buffer.from([1])),
        },
      },
    ]);

    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        const dbNFT = await NFT.findOne({
          mint: listing.account.nftMint.toString(),
        });

        return {
          address: listing.publicKey.toString(),
          seller: listing.account.seller.toString(),
          nftMint: listing.account.nftMint.toString(),
          price: listing.account.price.toString(),
          metadataUri: listing.account.metadataUri,
          isActive: listing.account.isActive,
          metadata: dbNFT
            ? {
                name: dbNFT.name,
                symbol: dbNFT.symbol,
                uri: dbNFT.uri,
              }
            : null,
        };
      })
    );

    res.json(enrichedListings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// src/utils/contract.ts
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { IDL } from "../IDL/nft_marketplace";

export class ContractService {
  private program: Program;
  private connection: Connection;

  constructor(connection: Connection, wallet: any) {
    const provider = new Provider(
      connection,
      wallet,
      Provider.defaultOptions()
    );
    this.program = new Program(IDL, new PublicKey("YOUR_PROGRAM_ID"), provider);
    this.connection = connection;
  }

  async listNFT(metadataUri: string, price: number, seller: PublicKey) {
    const listing = web3.Keypair.generate();

    return await this.program.methods
      .listNft(metadataUri, price)
      .accounts({
        marketplace: this.getMarketplacePDA(),
        listing: listing.publicKey,
        seller,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([listing])
      .rpc();
  }

  async purchaseNFT(listingAddress: PublicKey, buyer: PublicKey) {
    const listing = await this.program.account.nftListing.fetch(listingAddress);

    return await this.program.methods
      .purchaseNft()
      .accounts({
        listing: listingAddress,
        buyer,
        seller: listing.seller,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  }

  private getMarketplacePDA(): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("marketplace")],
      this.program.programId
    );
    return pda;
  }
}

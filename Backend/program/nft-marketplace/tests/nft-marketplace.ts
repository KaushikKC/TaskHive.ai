// program/tests/nft-marketplace.ts
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftMarketplace } from "../target/types/nft_marketplace";
import { expect } from "chai";

describe("nft-marketplace", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftMarketplace as Program<NftMarketplace>;

  it("Initializes marketplace", async () => {
    const marketplace = anchor.web3.Keypair.generate();

    await program.methods
      .initializeMarketplace()
      .accounts({
        marketplace: marketplace.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([marketplace])
      .rpc();

    const account = await program.account.marketplace.fetch(
      marketplace.publicKey
    );
    expect(account.authority.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
    expect(account.totalListings.toNumber()).to.equal(0);
  });
});

// programs/nft-marketplace/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("Bju9PZShAqcJzBMn6UJppQPp9YvAwkfiYaapiv467tBk");

#[program]
pub mod nft_marketplace {
    use super::*;

    // Initialize marketplace
    pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.total_listings = 0;
        Ok(())
    }

    // List NFT
    pub fn list_nft(
        ctx: Context<ListNFT>,
        metadata_uri: String,
        price: u64,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.nft_mint = ctx.accounts.nft_mint.key();
        listing.price = price;
        listing.metadata_uri = metadata_uri;
        listing.is_active = true;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings += 1;

        Ok(())
    }

    // Purchase NFT
    pub fn purchase_nft(ctx: Context<PurchaseNFT>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, ErrorCode::ListingNotActive);

        // Transfer SOL from buyer to seller
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &listing.seller,
            listing.price,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller.to_account_info(),
            ],
        )?;

        // Transfer NFT ownership
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 1)?;

        listing.is_active = false;

        Ok(())
    }

    // Update user identity
    pub fn update_user_identity(
        ctx: Context<UpdateUserIdentity>,
        action: String,
    ) -> Result<()> {
        let user_identity = &mut ctx.accounts.user_identity;
        
        match action.as_str() {
            "purchase" => {
                user_identity.total_purchases += 1;
                user_identity.reputation_score += 1;
            }
            "list" => {
                user_identity.total_listings += 1;
            }
            _ => {}
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 8 + 200 + 1
    )]
    pub listing: Account<'info, NFTListing>,
    pub nft_mint: Account<'info, token::Mint>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseNFT<'info> {
    #[account(mut)]
    pub listing: Account<'info, NFTListing>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Safe because we're just transferring to this account
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserIdentity<'info> {
    #[account(mut)]
    pub user_identity: Account<'info, UserIdentity>,
    pub user: Signer<'info>,
}

#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub total_listings: u64,
}

#[account]
pub struct NFTListing {
    pub seller: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
    pub metadata_uri: String,
    pub is_active: bool,
}

#[account]
pub struct UserIdentity {
    pub user: Pubkey,
    pub reputation_score: u64,
    pub total_purchases: u64,
    pub total_listings: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Listing is not active")]
    ListingNotActive,
}
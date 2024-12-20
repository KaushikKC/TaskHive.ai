use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3,
        mpl_token_metadata::types::{Creator, DataV2},
        CreateMetadataAccountsV3,
    },
    token::{self, Mint, Token, TokenAccount},
};

declare_id!("6Di8WKnAjaQ5dhZBCnDNSEuHye29YyMCj2ti7uRmysMR");

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.total_listings = 0;
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // Mint new token
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        );
        token::mint_to(cpi_context, 1)?;

        // Create metadata
        let creator = vec![Creator {
            address: ctx.accounts.payer.key(),
            verified: true,
            share: 100,
        }];

        let data_v2 = DataV2 {
            name: name,
            symbol: symbol,
            uri: uri,
            seller_fee_basis_points: 500, // 5% royalty
            creators: Some(creator),
            collection: None,
            uses: None,
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        create_metadata_accounts_v3(
            cpi_context,
            data_v2,
            true, // is_mutable
            true, // update_authority_is_signer
            None, // collection details
        )?;

        Ok(())
    }

    pub fn list_nft(ctx: Context<ListNFT>, price: u64, metadata_uri: String) -> Result<()> {
        require!(price > 0, ErrorCode::InvalidPrice);

        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.nft_mint = ctx.accounts.nft_mint.key();
        listing.price = price;
        listing.metadata_uri = metadata_uri;
        listing.is_active = true;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings = marketplace
            .total_listings
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        // Update user identity
        let user_identity = &mut ctx.accounts.user_identity;
        user_identity.total_listings = user_identity
            .total_listings
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn purchase_nft(ctx: Context<PurchaseNFT>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, ErrorCode::ListingNotActive);
        require!(
            ctx.accounts.buyer.lamports() >= listing.price,
            ErrorCode::InsufficientFunds
        );

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
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Transfer NFT
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 1)?;

        // Update listing status
        listing.is_active = false;

        // Update buyer's identity
        let user_identity = &mut ctx.accounts.user_identity;
        user_identity.total_purchases = user_identity
            .total_purchases
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;
        user_identity.reputation_score = user_identity
            .reputation_score
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: Account will be created by Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// CHECK: Validated in instruction
    #[account(
        constraint = token_metadata_program.key() == anchor_spl::metadata::ID
    )]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,

    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 8 + 200 + 1,
        seeds = [b"listing", nft_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, NFTListing>,

    pub nft_mint: Account<'info, Mint>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user_identity", seller.key().as_ref()],
        bump
    )]
    pub user_identity: Account<'info, UserIdentity>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseNFT<'info> {
    #[account(mut)]
    pub listing: Account<'info, NFTListing>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Validated in listing account
    #[account(mut)]
    pub seller: AccountInfo<'info>,

    #[account(
        mut,
        constraint = seller_token_account.owner == listing.seller,
        constraint = seller_token_account.mint == listing.nft_mint
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = buyer_token_account.owner == buyer.key(),
        constraint = buyer_token_account.mint == listing.nft_mint
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"user_identity", buyer.key().as_ref()],
        bump
    )]
    pub user_identity: Account<'info, UserIdentity>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
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
    #[msg("Invalid listing price")]
    InvalidPrice,
    #[msg("Insufficient funds for purchase")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    Overflow,
}

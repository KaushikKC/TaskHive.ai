use anchor_lang::{prelude::*, solana_program::program::invoke_signed, system_program};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Token, TokenAccount, Transfer},
};
use solana_program::pubkey::Pubkey;

declare_id!("Bju9PZShAqcJzBMn6UJppQPp9YvAwkfiYaapiv467tBk");

#[program]
pub mod ai_agent_infrastructure {
    use super::*;

    // Identity Management Functions
    pub fn initialize_identity(
        ctx: Context<InitializeIdentity>,
        preferences: String,
        reputation: u8,
    ) -> Result<()> {
        // Validate input
        require!(preferences.len() <= 1024, ErrorCode::PreferencesTooLong);
        require!(reputation <= 100, ErrorCode::InvalidReputation);

        // Create identity account
        let identity = &mut ctx.accounts.identity;
        identity.wallet_address = ctx.accounts.user.key();
        identity.preferences = preferences;
        identity.reputation = reputation;
        identity.created_at = Clock::get()?.unix_timestamp;

        emit!(IdentityInitializedEvent {
            wallet_address: identity.wallet_address,
            reputation: identity.reputation,
            timestamp: identity.created_at
        });

        Ok(())
    }

    pub fn update_preferences(ctx: Context<UpdateIdentity>, new_preferences: String) -> Result<()> {
        // Validate input
        require!(new_preferences.len() <= 1024, ErrorCode::PreferencesTooLong);

        // Update preferences
        let identity = &mut ctx.accounts.identity;
        identity.preferences = new_preferences;
        identity.updated_at = Some(Clock::get()?.unix_timestamp);

        emit!(PreferencesUpdatedEvent {
            wallet_address: identity.wallet_address,
            timestamp: identity.updated_at.unwrap()
        });

        Ok(())
    }

    pub fn update_reputation(ctx: Context<UpdateIdentity>, new_reputation: u8) -> Result<()> {
        // Validate input
        require!(new_reputation <= 100, ErrorCode::InvalidReputation);

        // Update reputation
        let identity = &mut ctx.accounts.identity;
        identity.reputation = new_reputation;

        emit!(ReputationUpdatedEvent {
            wallet_address: identity.wallet_address,
            new_reputation: new_reputation
        });

        Ok(())
    }

    // New Reputation Management Function
    pub fn update_reputation_with_proof(
        ctx: Context<UpdateReputationProof>,
        task_id: String,
        reputation_change: i8,
    ) -> Result<()> {
        // Validate input
        require!(
            reputation_change >= -10 && reputation_change <= 10,
            ErrorCode::InvalidReputationChange
        );

        let identity = &mut ctx.accounts.identity;

        // Calculate new reputation with safe bounds
        let new_reputation = (identity.reputation as i8 + reputation_change)
            .max(0)
            .min(100) as u8;

        identity.reputation = new_reputation;
        identity.updated_at = Some(Clock::get()?.unix_timestamp);

        emit!(ReputationProofUpdatedEvent {
            wallet_address: identity.wallet_address,
            task_id,
            reputation_change,
            new_reputation
        });

        Ok(())
    }

    // Task Proof Logging Functions
    pub fn log_task_outcome(
        ctx: Context<LogTaskOutcome>,
        task_id: String,
        outcome: String,
        outcome_type: TaskOutcomeType,
        metadata: Option<String>,
    ) -> Result<()> {
        // Validate input
        require!(task_id.len() <= 128, ErrorCode::TaskIdTooLong);
        require!(outcome.len() <= 2048, ErrorCode::OutcomeTooLong);

        // Log task outcome
        let task_log = &mut ctx.accounts.task_log;
        task_log.task_id = task_id;
        task_log.wallet_address = ctx.accounts.user.key();
        task_log.outcome = outcome;
        task_log.outcome_type = outcome_type;
        task_log.timestamp = Clock::get()?.unix_timestamp;
        task_log.metadata = metadata;

        emit!(TaskOutcomeLoggedEvent {
            task_id: task_log.task_id.clone(),
            wallet_address: task_log.wallet_address,
            outcome_type: task_log.outcome_type.clone(),
            timestamp: task_log.timestamp
        });

        Ok(())
    }

    // Enhanced Task Proof Logging
    pub fn log_task_execution_proof(
        ctx: Context<LogTaskExecutionProof>,
        task_id: String,
        execution_status: TaskExecutionStatus,
        proof_metadata: Option<String>,
    ) -> Result<()> {
        // Validate input
        require!(task_id.len() <= 128, ErrorCode::TaskIdTooLong);
        require!(
            proof_metadata.as_ref().map_or(true, |m| m.len() <= 2048),
            ErrorCode::ProofMetadataTooLong
        );

        let task_proof = &mut ctx.accounts.task_proof;
        task_proof.task_id = task_id;
        task_proof.wallet_address = ctx.accounts.user.key();
        task_proof.execution_status = execution_status;
        task_proof.timestamp = Clock::get()?.unix_timestamp;
        task_proof.proof_metadata = proof_metadata;

        emit!(TaskExecutionProofLoggedEvent {
            task_id: task_proof.task_id.clone(),
            wallet_address: task_proof.wallet_address,
            execution_status: task_proof.execution_status.clone(),
            timestamp: task_proof.timestamp
        });

        Ok(())
    }

    pub fn validate_nft_purchase(
        ctx: Context<ValidateNftPurchase>,
        max_budget: u64,
        task_criteria: NftPurchaseCriteria,
    ) -> Result<()> {
        let nft_metadata = &ctx.accounts.nft_metadata;
        let purchase_details = &ctx.accounts.purchase_details;

        // Validate NFT price is within budget
        require!(
            purchase_details.price <= max_budget,
            ErrorCode::NftPriceBeyondBudget
        );

        // Check NFT collection verification
        require!(
            nft_metadata.collection.is_some(),
            ErrorCode::InvalidNftCollection
        );

        // Validate against specific task criteria
        match task_criteria {
            NftPurchaseCriteria::CheapestInCategory => {
                // Additional logic to verify it's the cheapest in its category
                // This would typically involve cross-referencing with an off-chain oracle or marketplace
            }
            NftPurchaseCriteria::RarityThreshold(rarity_level) => {
                require!(
                    nft_metadata.rarity_score >= rarity_level,
                    ErrorCode::NftBelowRarityThreshold
                );
            }
        }

        // Log validated NFT purchase
        emit!(NftPurchaseValidatedEvent {
            buyer: ctx.accounts.buyer.key(),
            nft_mint: nft_metadata.mint,
            price: purchase_details.price,
            timestamp: Clock::get()?.unix_timestamp
        });

        Ok(())
    }

    // New: Decentralized Feedback Mechanism
    pub fn submit_user_feedback(
        ctx: Context<SubmitUserFeedback>,
        feedback_score: i8,
        feedback_type: FeedbackType,
        description: Option<String>,
    ) -> Result<()> {
        // Validate feedback input
        require!(
            feedback_score >= -10 && feedback_score <= 10,
            ErrorCode::InvalidFeedbackScore
        );

        // Update user identity based on feedback
        let identity = &mut ctx.accounts.identity;

        // Dynamic reputation adjustment
        let reputation_change = match feedback_type {
            FeedbackType::TaskPerformance => feedback_score,
            FeedbackType::Reliability => feedback_score / 2,
            FeedbackType::Communication => feedback_score / 3,
        };

        // Safe reputation calculation
        let new_reputation = (identity.reputation as i8 + reputation_change)
            .max(0)
            .min(100) as u8;

        identity.reputation = new_reputation;

    

        emit!(UserFeedbackSubmittedEvent {
            subject: identity.wallet_address,
            submitter: ctx.accounts.submitter.key(),
            feedback_type: feedback_type.clone(),
            reputation_change,
            new_reputation
        });

        Ok(())
    }

    // Payment Integration Function
    pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64, token: Pubkey) -> Result<()> {
        // Validate payment
        require!(amount > 0, ErrorCode::InvalidPaymentAmount);

        // Perform token transfer
        let transfer_instruction = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;

        emit!(PaymentProcessedEvent {
            from: ctx.accounts.payer.key(),
            to: ctx.accounts.to_token_account.key(),
            amount,
            token
        });

        Ok(())
    }

    // Solana Pay Integration
    pub fn process_solana_pay_task(
        ctx: Context<SolanaPayTask>,
        amount: u64,
        task_details: Vec<u8>,
    ) -> Result<()> {
        // Validate payment
        require!(amount > 0, ErrorCode::InvalidPaymentAmount);

        // Transfer SOL using system program
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.sender.to_account_info(),
                    to: ctx.accounts.recipient.to_account_info(),
                },
            ),
            amount,
        )?;

        emit!(SolanaPayTaskProcessedEvent {
            sender: ctx.accounts.sender.key(),
            recipient: ctx.accounts.recipient.key(),
            amount,
            task_details: task_details
        });

        Ok(())
    }

    pub fn update_onchain_identity(
        ctx: Context<UpdateIdentity>,
        preferences: String,
        reputation: u8,
    ) -> Result<()> {
        // Logic to update user identity onchain
        // Validate and update preferences and reputation
        Ok(())
    }

}

// Context Structs for Account Validation
#[derive(Accounts)]
pub struct InitializeIdentity<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 1024 + 1 + 8 + 8,
        seeds = [b"identity", user.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateIdentity<'info> {
    #[account(
        mut, 
        seeds = [b"identity", user.key().as_ref()],
        bump,
        constraint = identity.wallet_address == user.key() // Use constraint instead of has_one
    )]
    pub identity: Account<'info, Identity>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateReputationProof<'info> {
    #[account(
        mut, 
        seeds = [b"identity", user.key().as_ref()],
        bump,
        constraint = identity.wallet_address == user.key()
    )]
    pub identity: Account<'info, Identity>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ValidateNftPurchase<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,

    pub purchase_details: Account<'info, NftPurchaseDetails>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SubmitUserFeedback<'info> {
    #[account(
        mut, 
        seeds = [b"identity", identity.wallet_address.as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,

    #[account(mut)]
    pub submitter: Signer<'info>,

}

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct LogTaskExecutionProof<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 128 + 32 + 1 + 8 + 256,
        seeds = [b"task_proof", user.key().as_ref(), task_id.as_bytes()],
        bump
    )]
    pub task_proof: Account<'info, TaskExecutionProof>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SolanaPayTask<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub recipient: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct LogTaskOutcome<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 128 + 32 + 2048 + 1 + 8 + 256,
        seeds = [b"task_log", user.key().as_ref(), task_id.as_bytes()],
        bump
    )]
    pub task_log: Account<'info, TaskLog>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

// Account Structures
#[account]
pub struct Identity {
    pub wallet_address: Pubkey,
    pub preferences: String,
    pub reputation: u8,
    pub created_at: i64,
    pub updated_at: Option<i64>,
}



#[account]
pub struct TaskExecutionProof {
    pub task_id: String,
    pub wallet_address: Pubkey,
    pub execution_status: TaskExecutionStatus,
    pub timestamp: i64,
    pub proof_metadata: Option<String>,
}

#[account]
pub struct NftMetadata {
    pub mint: Pubkey,
    pub collection: Option<Pubkey>,
    pub rarity_score: u8,
    pub attributes: Vec<NftAttribute>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct NftAttribute {
    pub trait_type: String,
    pub value: String,
}

#[account]
pub struct NftPurchaseDetails {
    pub mint: Pubkey,
    pub price: u64,
    pub purchase_timestamp: i64,
}

#[account]
pub struct TaskLog {
    pub task_id: String,
    pub wallet_address: Pubkey,
    pub outcome: String,
    pub outcome_type: TaskOutcomeType,
    pub timestamp: i64,
    pub metadata: Option<String>,
}


#[derive(Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum NftPurchaseCriteria {
    CheapestInCategory,
    RarityThreshold(u8),
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum FeedbackType {
    TaskPerformance,
    Reliability,
    Communication,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum TaskOutcomeType {
    NftPurchase,
    FlightBooking,
    CryptoTransfer,
    Other,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum TaskExecutionStatus {
    Success,
    Partial,
    Failed,
    Pending,
}

// Custom Error Codes
#[error_code]
pub enum ErrorCode {
    #[msg("Preferences exceed maximum allowed length")]
    PreferencesTooLong,

    #[msg("Invalid reputation score")]
    InvalidReputation,

    #[msg("Task ID exceeds maximum length")]
    TaskIdTooLong,

    #[msg("Task outcome exceeds maximum length")]
    OutcomeTooLong,

    #[msg("Invalid payment amount")]
    InvalidPaymentAmount,

    #[msg("Invalid reputation change")]
    InvalidReputationChange,

    #[msg("Proof metadata exceeds maximum length")]
    ProofMetadataTooLong,

    #[msg("NFT price exceeds specified budget")]
    NftPriceBeyondBudget,

    #[msg("Invalid NFT collection")]
    InvalidNftCollection,

    #[msg("NFT does not meet rarity threshold")]
    NftBelowRarityThreshold,

    #[msg("Invalid feedback score")]
    InvalidFeedbackScore,

    #[msg("Invalid Shadow Drive CID")]
    InvalidShadowCid,

    #[msg("Shadow Drive storage not initialized")]
    ShadowStorageNotInitialized,
}
// Event Structs for Logging
#[event]
pub struct IdentityInitializedEvent {
    pub wallet_address: Pubkey,
    pub reputation: u8,
    pub timestamp: i64,
}

#[event]
pub struct PreferencesUpdatedEvent {
    pub wallet_address: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ReputationUpdatedEvent {
    pub wallet_address: Pubkey,
    pub new_reputation: u8,
}

#[event]
pub struct ShadowStorageInitializedEvent {
    pub owner: Pubkey,
    pub size: u64,
    pub timestamp: i64,
}

#[event]
pub struct TaskOutcomeLoggedEvent {
    pub task_id: String,
    pub wallet_address: Pubkey,
    pub outcome_type: TaskOutcomeType,
    pub timestamp: i64,
}


#[event]
pub struct PaymentProcessedEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub token: Pubkey,
}

#[event]
pub struct ReputationProofUpdatedEvent {
    pub wallet_address: Pubkey,
    pub task_id: String,
    pub reputation_change: i8,
    pub new_reputation: u8,
}

#[event]
pub struct TaskExecutionProofLoggedEvent {
    pub task_id: String,
    pub wallet_address: Pubkey,
    pub execution_status: TaskExecutionStatus,
    pub timestamp: i64,
}

#[event]
pub struct NftPurchaseValidatedEvent {
    pub buyer: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
    pub timestamp: i64,
}

#[event]
pub struct UserFeedbackSubmittedEvent {
    pub subject: Pubkey,
    pub submitter: Pubkey,
    pub feedback_type: FeedbackType,
    pub reputation_change: i8,
    pub new_reputation: u8,
}

#[event]
pub struct SolanaPayTaskProcessedEvent {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub task_details: Vec<u8>,
}

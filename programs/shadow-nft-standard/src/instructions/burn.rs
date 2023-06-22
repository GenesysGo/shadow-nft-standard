//! This module contains all code for the `burn` instruction,
//! which burns an NFT spl token and its metadata account
use anchor_lang::prelude::*;

use crate::{
    common::{check_ata, metadata::Metadata},
    verbose_msg,
};

#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{self as token_program_used, Mint, Token, TokenAccount};
#[cfg(feature = "use-token-2022")]
use {
    crate::common::token_2022::{Mint, Token2022 as Token, TokenAccount},
    spl_token_2022 as token_program_used,
};

const ZERO_DECIMALS: u8 = 0;
const BURN_ONE: u64 = 1;

/// This handler does not need to perform any checks (unless we make nfts optionally non-burnable
/// in the future) as the only thing required should be the user signature which is checked by
/// anchor's `Signer` type.
pub fn handle_burn(ctx: Context<Burn>) -> Result<()> {
    // Burn NFT
    // A check for post-mint/post-primary is not strictly required since the token burn
    // will only succeed if there exists at least one token which can only exist post-mint.
    let burn_ix = token_program_used::instruction::burn_checked(
        &token_program_used::ID,
        &ctx.accounts.owner_ata.key(),
        &ctx.accounts.asset_mint.key(),
        &ctx.accounts.owner_ata.owner,
        &[&ctx.accounts.owner.key()],
        BURN_ONE,
        ZERO_DECIMALS,
    )?;
    anchor_lang::solana_program::program::invoke(
        &burn_ix,
        &[
            ctx.accounts.owner_ata.to_account_info(),
            ctx.accounts.asset_mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
        ],
    )?;
    verbose_msg!("Burned NFT");

    // Close Token Account
    let close_ix = token_program_used::instruction::close_account(
        &token_program_used::ID,
        &ctx.accounts.owner_ata.key(),
        &ctx.accounts.owner_ata.owner,
        &ctx.accounts.owner_ata.owner,
        &[&ctx.accounts.owner_ata.owner],
    )?;
    anchor_lang::solana_program::program::invoke(
        &close_ix,
        &[
            ctx.accounts.owner_ata.to_account_info(),
            ctx.accounts.asset_mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
        ],
    )?;
    verbose_msg!("Closed Token Account");

    Ok(())
}

#[derive(Accounts)]
pub struct Burn<'info> {
    /// Metadata account to burn
    #[account(
        mut,
        close = owner,
        seeds = [
            asset_mint.key().as_ref()
        ],
        bump
    )]
    pub metadata: Account<'info, Metadata>,

    /// NFT Token Mint
    #[account(mut)]
    pub asset_mint: Account<'info, Mint>,

    /// Owner's Token Account
    #[account(
        mut,
        constraint = check_ata(&owner, &owner_ata, &asset_mint)
    )]
    pub owner_ata: Account<'info, TokenAccount>,

    /// Owner of the NFT
    #[account(mut)]
    pub owner: Signer<'info>,

    /// Token program
    pub token_program: Program<'info, Token>,

    /// System program
    pub system_program: Program<'info, System>,
}

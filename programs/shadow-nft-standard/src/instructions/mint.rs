//! This module contains all code for the `mint` instruction, which mints an NFT.
//!
//! This instruction will initialize an associated token account if needed, and update
//! the metadata account
use anchor_lang::{
    prelude::*,
    solana_program::{self},
    system_program,
};
use anchor_spl::associated_token::AssociatedToken;

use solana_program::{program::invoke, system_instruction};

#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{spl_token as spl_token_program_used, Mint, Token};
#[cfg(feature = "use-token-2022")]
use {
    crate::common::token_2022::{Mint, Token2022 as Token},
    spl_token_2022 as spl_token_program_used,
};

use crate::{
    common::{check_ata, collection::Collection, metadata::Metadata},
    error::ErrorCode,
    verbose_msg,
};

const MINT_ONE_TOKEN: u64 = 1;

/// This handler must check that this is a primary sale before attempting to mint an NFT.
///
/// TODO: As is, anyone can mint this NFT at any time as soon as the metadata is created.
///
/// This is fine for the minter setup since we create meta and mint in the same ix, but for
/// 1/1s down the line we need to either ensure that the metadata of THIS asset was created
/// in the last ix using instruction introspection or use another sort of gate.
pub fn handle_mint(ctx: Context<MintNFT>, cost_lamports: u64) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;

    // Check primary sale
    if metadata.post_primary {
        return Err(ErrorCode::PrimarySale.into());
    }
    metadata.post_primary = true;

    // Check user balance
    if ctx.accounts.minter.lamports() < cost_lamports {
        return Err(ErrorCode::InsufficientSolForMint.into());
    }

    invoke(
        &system_instruction::transfer(
            &ctx.accounts.minter.key(),
            &ctx.accounts.collection.key(),
            cost_lamports,
        ),
        &[
            ctx.accounts.minter.to_account_info(),
            ctx.accounts.collection.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    #[cfg(feature = "verbose")]
    {
        // Create a stack-allocated buffer
        let mut buf = num_format::Buffer::default();
        buf.write_formatted(&cost_lamports, &num_format::Locale::en);
        msg!("Transfered {} lamports from user", buf.as_str());
    }

    // Mint NFT and remove mint authority
    mint_and_remove_authority(ctx)?;
    verbose_msg!("Minted NFT to user ata");

    Ok(())
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        seeds = [
            // NOTE: a constraint is not necessary.
            // the pda derivation serves as a check.
            asset_mint.key().as_ref()
        ],
        bump,
    )]
    pub metadata: Account<'info, Metadata>,

    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        mut,
        constraint = check_ata(&minter, &minter_ata, &asset_mint)
    )]
    /// CHECK: we check ata address
    pub minter_ata: AccountInfo<'info>,

    #[account(mut)]
    pub asset_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = collection.key() == metadata.collection_key,
    )]
    pub collection: Account<'info, Collection>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

fn mint_and_remove_authority(ctx: Context<MintNFT>) -> Result<()> {
    // Signer seeds, used for mint_to and set_authority
    let seeds: &[&[&[u8]]] = &[&[
        &ctx.accounts.asset_mint.key().to_bytes(),
        &[*ctx.bumps.get("metadata").unwrap()],
    ]];

    // At this stage we have validated token address, which is a PDA associated with the
    // associated token program so just init if needed
    if *ctx.accounts.minter_ata.owner == system_program::ID {
        let create_account_ix =
            spl_associated_token_account::instruction::create_associated_token_account(
                ctx.accounts.minter.key,
                ctx.accounts.minter.key,
                &ctx.accounts.asset_mint.key(),
                ctx.accounts.token_program.key,
            );
        solana_program::program::invoke(
            &create_account_ix,
            &[
                ctx.accounts.minter.to_account_info(),
                ctx.accounts.minter_ata.to_account_info(),
                ctx.accounts.minter.to_account_info(),
                ctx.accounts.asset_mint.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
            ],
        )?;
    }

    // Mint nft
    let mint_to_ix = spl_token_program_used::instruction::mint_to(
        &spl_token_program_used::ID,
        &ctx.accounts.asset_mint.key(),
        &ctx.accounts.minter_ata.key(),
        &ctx.accounts.metadata.key(),
        &[],
        MINT_ONE_TOKEN,
    )?;
    verbose_msg!("Minting NFT");
    solana_program::program::invoke_signed(
        &mint_to_ix,
        &[
            ctx.accounts.asset_mint.to_account_info(),
            ctx.accounts.minter_ata.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
        ],
        seeds,
    )?;

    // Remove mint authority
    let set_authority_ix = spl_token_program_used::instruction::set_authority(
        &spl_token_program_used::ID,
        &ctx.accounts.asset_mint.key(),
        None,
        spl_token_program_used::instruction::AuthorityType::MintTokens,
        &ctx.accounts.metadata.key(),
        &[],
    )?;
    verbose_msg!("Removing Mint Authority");
    solana_program::program::invoke_signed(
        &set_authority_ix,
        &[
            ctx.accounts.asset_mint.to_account_info(),
            ctx.accounts.minter_ata.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
        ],
        seeds,
    )?;

    Ok(())
}

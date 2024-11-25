//! This module contains all code for the `create_group` instruction,
//! which initializes a creator group account.
use anchor_lang::prelude::*;

use crate::{
    common::{
        _get_creator_group_seed,
        creator_group::{get_create_group_creators_sorted, CreatorGroup},
    },
    error::ErrorCode,
    verbose_msg,
};

/// This handler must ensure all creators agreed (signed) to form this group
/// before initializing the `CreatorGroup` value. This should be done regardless
/// of `multisig`.
pub fn handle_create_group(ctx: Context<CreateGroup>, args: CreateGroupArgs) -> Result<()> {
    // Gather signing creator
    let mut creators = Vec::with_capacity(1 + ctx.remaining_accounts.len());
    creators.push(ctx.accounts.creator.key());

    // Gather other creators
    for other_creator in ctx.remaining_accounts {
        require_keys_neq!(
            other_creator.key(),
            ctx.accounts.creator.key(),
            ErrorCode::DuplicateCreator
        );
        creators.push(other_creator.key());
    }

    // Sort creators to preserve order
    creators.sort();

    // Update signatures (This is idempotent)
    ctx.accounts.creator_group.sigs |= 1
        << creators
            .iter()
            .position(|c| c == ctx.accounts.creator.key)
            .unwrap();

    if ctx.accounts.creator_group.creators.is_empty() {
        // Only need to memcpy on first pass, and should not be able to update name here
        ctx.accounts.creator_group.creators = creators;
        ctx.accounts.creator_group.name = args.name;
    }

    if ctx.accounts.creator_group.sigs.count_ones()
        == ctx.accounts.creator_group.creators.len() as u32
    {
        verbose_msg!(
            "Created group {} with {} members",
            ctx.accounts.creator_group.key(),
            ctx.accounts.creator_group.creators.len(),
        );
    } else {
        verbose_msg!(
            "Creating group {}: {}/{} members have signed",
            ctx.accounts.creator_group.key(),
            ctx.accounts.creator_group.sigs.count_ones(),
            ctx.accounts.creator_group.creators.len(),
        );
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    args: CreateGroupArgs
)]
/// NOTE: if this struct ever changes, `get_create_group_creators` needs to be revisited.
pub struct CreateGroup<'info> {
    /// The creator group account to be initialized
    #[account(
        init_if_needed,
        payer = creator,
        space = {
            const DISCRIMINATOR: usize = 8;
            // At this stage, accounts only includes additional accounts
            let creator_keys = (accounts.len() + 1) * ::core::mem::size_of::<Pubkey>() + 4;
            let collections = ::core::mem::size_of::<u64>();
            let sigs = ::core::mem::size_of::<u8>();
            let name = 4 + args.name.as_bytes().len();

            DISCRIMINATOR + collections + sigs + creator_keys + name

        },
        seeds = [
            _get_creator_group_seed(&get_create_group_creators_sorted(creator.key(), accounts)?).as_ref()
        ],
        bump
    )]
    pub creator_group: Account<'info, CreatorGroup>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateGroupArgs {
    pub name: String,
}

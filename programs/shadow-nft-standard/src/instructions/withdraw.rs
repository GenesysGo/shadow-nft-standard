//! This module contains all code for the `mint` instruction, which mints an NFT.
//!
//! This instruction will initialize an associated token account if needed, and update
//! the metadata account
use anchor_lang::prelude::*;

use crate::{
    common::{collection::Collection, creator_group::CreatorGroup},
    error::ErrorCode,
    verbose_msg,
};

pub fn handle_withdraw<'a>(ctx: Context<'_, '_, '_, 'a, Withdraw<'a>>) -> Result<()> {
    let collection = &ctx.accounts.collection;
    let collection_info = ctx.accounts.collection.to_account_info();
    let creator_group = &ctx.accounts.creator_group;

    // Get excess lamports
    let rent = Rent::get()?;
    let data_len: usize = collection_info.data_len();
    let excess_lamports: u64 = collection_info
        .lamports()
        .checked_sub(rent.minimum_balance(data_len))
        .unwrap();
    verbose_msg!("Collection has {} excess lamports", excess_lamports);

    // Get denominator
    let total_bps = collection
        .royalty_50bps
        .iter()
        .take(creator_group.creators.len())
        .sum::<u8>();
    if total_bps == 0 {
        return Ok(());
    }

    // Subtract excess from collection
    **collection_info.try_borrow_mut_lamports()? -= excess_lamports;

    // Shares
    let mut total_distributed = 0;
    let payer_creator_info = ctx.accounts.payer_creator.to_account_info();
    for (creator_share, creator) in collection
        .royalty_50bps
        .into_iter()
        .take(creator_group.creators.len())
        .map(|bps| ((excess_lamports as u128 * bps as u128) / total_bps as u128) as u64)
        .zip(&creator_group.creators)
    {
        if let Some(present_creator) = std::iter::once(&payer_creator_info)
            .chain(ctx.remaining_accounts)
            .find(|c| c.key == creator)
        {
            **present_creator.try_borrow_mut_lamports()? += creator_share;
            total_distributed += creator_share;
            verbose_msg!("{} receiving {}", present_creator.key, creator_share);
        } else {
            return Err(ErrorCode::CreatorNotPresentForMultisig.into());
        }
    }

    // Give remaining amount not distributed due to rounding down to payer_creator because of tx fee
    if excess_lamports - total_distributed > 0 {
        **payer_creator_info.try_borrow_mut_lamports()? += excess_lamports - total_distributed;
        verbose_msg!(
            "{} receiving remaining {} since they are paying tx fee",
            payer_creator_info.key,
            excess_lamports - total_distributed
        );
    }

    Ok(())
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        constraint = creator_group.creators.contains(&payer_creator.key()),
    )]
    pub payer_creator: Signer<'info>,

    #[account(
        mut,
        seeds = [
            creator_group.key().as_ref(),
            collection.name.as_ref(),
        ],
        bump
    )]
    pub collection: Account<'info, Collection>,

    #[account()]
    pub creator_group: Account<'info, CreatorGroup>,
}

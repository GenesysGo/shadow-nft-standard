//! This module contains all the code for the `update` instruction,
//! which allow an authority to update a mutable metadata account.

use std::str::FromStr;

use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    common::{
        calculate_metadata_space, collection::Collection, creator_group::CreatorGroup,
        metadata::Metadata, Url,
    },
    error::ErrorCode,
    verbose_msg,
};

#[cfg(feature = "use-token-2022")]
use crate::common::token_2022::Mint;
#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::Mint;

/// This handler must first check for appropriate authorization and properties:
/// 1) Caller is authorized to change metadata
/// 2) Metadata account is mutable
///
/// Then, it must update the metadata fields.
pub fn handle_update(ctx: Context<UpdateMetadata>, args: UpdateMetaArgs) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;

    // Check that caller is authorized
    if metadata.update_authority != metadata.update_authority.key() {
        msg!("Caller is not the update_authority");
        return Err(ErrorCode::Unauthorized.into());
    }

    // Check that the metadata is mutable
    if !metadata.mutable {
        return Err(ErrorCode::ImmutableAccount.into());
    }

    // Update metadata account fields after recording initial size
    let old_size = calculate_metadata_space(&metadata.name, &metadata.uri);

    // 1) Check if a new name was provided
    if let Some(new_name) = args.name {
        verbose_msg!("Updating name to {}", new_name);
        metadata.name = new_name;
    }

    // 2) Check if a new uri was provided
    if let Some(ref new_uri) = args.uri {
        match Url::from_str(new_uri) {
            Ok(valid_new_uri) => {
                verbose_msg!("Updating uri to {}", valid_new_uri.to_string());
                metadata.uri = valid_new_uri;
            }
            Err(e) => {
                verbose_msg!("Invalid new uri: {}", e);
                return Err(ErrorCode::InvalidArguments.into());
            }
        }
    }

    // 3) Check if the metadata account is being marked as immutable
    if let Some(new_mutable_flag) = args.mutable {
        if !new_mutable_flag {
            verbose_msg!("Metadata is being marked as immutable!");
            metadata.mutable = new_mutable_flag;
        }
    }

    // Resize if needed
    let new_size = calculate_metadata_space(&metadata.name, &metadata.uri);
    let metadata_info = metadata.to_account_info();
    metadata_info.realloc(new_size, false)?;
    if new_size > old_size {
        // If the account requires more space the user must pay for the additional rent

        // First calculate additional rent
        let rent = Rent::get()?;
        let additional_rent_lamports: u64 =
            rent.minimum_balance(new_size) - rent.minimum_balance(old_size);

        // Transfer lamports
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.update_authority.to_account_info(),
                    to: metadata_info,
                },
            ),
            additional_rent_lamports,
        )?;
    } else if new_size < old_size {
        // If the account requires less space, we reimburse the user

        // First calculate reimbursement lamports
        let rent = Rent::get()?;
        let reimbursement_lamports: u64 =
            rent.minimum_balance(old_size) - rent.minimum_balance(new_size);

        // Reimburse
        **metadata_info.try_borrow_mut_lamports()? -= reimbursement_lamports;
        **ctx
            .accounts
            .update_authority
            .to_account_info()
            .try_borrow_mut_lamports()? += reimbursement_lamports;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    /// The metadata account in question. Since it is already initialized,
    /// the asset_mint must be valid since it was checked upon initialization.
    #[account(
        mut,
        seeds = [
            asset_mint.key().as_ref(),
        ],
        bump
    )]
    pub metadata: Account<'info, Metadata>,

    /// The mint of the nft in question. Checked upon initialization
    #[account()]
    pub asset_mint: Account<'info, Mint>,

    /// CHECK: The caller of the `update` instruction.
    #[account(
        // If the update authority is not a creator_group, then it can sign, otherwise this should be a creator.
        constraint = (metadata.update_authority == update_authority.key())
            // Checks multisig
            || (metadata.collection_key == collection.key() && collection.creator_group_key == creator_group.key() && creator_group.creators.contains(&update_authority.key()))
    )]
    pub update_authority: Signer<'info>,

    /// The creator of the NFT and collection
    #[account()]
    pub creator_group: Account<'info, CreatorGroup>,

    /// The collection that the NFT belongs to
    #[account()]
    pub collection: Account<'info, Collection>,

    pub system_program: Program<'info, System>,
}

/// Only the following fields should be updatable:
/// 1) name
/// 3) uri
/// 5) mutable
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateMetaArgs {
    pub name: Option<String>,
    pub uri: Option<String>,
    pub mutable: Option<bool>,
}

//! This module contains all code for the `create` instruction,
//! which initializes a metadata account for an NFT.
use crate::{
    common::{
        _get_creator_group_seed, check_multisig,
        collection::Collection,
        creator_group::CreatorGroup,
        metadata::{calculate_metadata_space, Metadata},
        url::Url,
    },
    error::ErrorCode,
    verbose_msg,
};
use anchor_lang::{prelude::*, solana_program::program_option::COption};
use shadow_nft_common::payer_pda::get_payer_pda;

#[cfg(feature = "use-token-2022")]
use crate::common::token_2022::{Mint, Token2022 as Token};
#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{Mint, Token};

/// This handler must first check for appropriate token mint account properties:
/// 1) Supply = 0
/// 2) Decimals = 0
/// 3) Mint authority = metadata account
///
/// Then, it must initialize all metadata fields
pub fn handle_create_metadata(
    ctx: Context<CreateMetadataAccount>,
    args: CreateMetaArgs,
) -> Result<()> {
    // Check mint account for non-fungibility
    let incorrect_mint_authority =
        ctx.accounts.asset_mint.mint_authority != COption::Some(ctx.accounts.metadata.key());

    if incorrect_mint_authority {
        return Err(ErrorCode::InvalidMintAuthority.into());
    };

    let some_freeze_authority = ctx.accounts.asset_mint.freeze_authority.is_some();
    if some_freeze_authority {
        return Err(ErrorCode::FreezeAuthorityPresent.into());
    }
    let unitary = (ctx.accounts.asset_mint.supply == 0) & (ctx.accounts.asset_mint.decimals == 0);
    if !unitary {
        return Err(ErrorCode::DivisibleToken.into());
    }
    verbose_msg!("Verified Non-Fungibility");

    // Check collection is initialized
    if !ctx
        .accounts
        .collection
        .initialized(&ctx.accounts.creator_group.creators)
    {
        return Err(ErrorCode::UnintializedCollection.into());
    };

    // Check multisig
    if ctx.accounts.creator_group.creators.len() > 1 {
        check_multisig(
            &ctx.accounts.creator_group.creators,
            ctx.accounts.payer_creator.key,
            ctx.remaining_accounts,
        )?;
    }

    // Initialize metadata
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.asset_mint.key();
    metadata.update_authority = args.update_authority;
    metadata.collection_key = args.collection_key;
    metadata.post_primary = false;
    metadata.mutable = args.mutable;
    metadata.name = args.name;
    metadata.uri = args.uri;
    verbose_msg!("Initialized Metadata Account");

    // Increment collection size
    ctx.accounts.collection.size = ctx
        .accounts
        .collection
        .size
        .checked_add(1)
        .ok_or(ErrorCode::IntegerOverflow)?;
    verbose_msg!("Collection now has {} items", ctx.accounts.collection.size);

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    args: CreateMetaArgs
)]
pub struct CreateMetadataAccount<'info> {
    /// The metadata account to be initialized.
    #[account(
        init,
        payer = payer_creator,
        seeds = [
            asset_mint.key().as_ref()
        ],
        bump,
        space = calculate_metadata_space(&args.name, &args.uri)
    )]
    pub metadata: Account<'info, Metadata>,

    /// NOTE: If this mutability changes + if creator group code changes,
    /// we must revisit group seed
    #[account(
        seeds = [
            // This assumes creator group is already sorted,
            // which is done at group account initialization
            _get_creator_group_seed(&creator_group.creators).as_ref()
        ],
        bump,
    )]
    pub creator_group: Account<'info, CreatorGroup>,

    /// The token program mint account of the NFT
    #[account()]
    pub asset_mint: Account<'info, Mint>,

    /// The `Collection` account associated with this NFT
    #[account(
        mut,
        address = args.collection_key
    )]
    pub collection: Account<'info, Collection>,

    /// Either a creator or an ephemeral payer pda from the minter program.
    #[account(
        mut,
        // This constraint checks whether the signer is an authorized creator, or a minter from the minter program.
        constraint = {
            let is_authorized_creator = creator_group.creators.contains(payer_creator.key) & !collection.for_minter;
            // For now, The ONLY cpi from the minter program into this program is the mint
            // instruction with a PayerPda account.
            let is_correct_and_authorized_minter_program_payer_pda = 
                (*payer_creator.key == get_payer_pda(&asset_mint.key())) & collection.for_minter;

            is_authorized_creator || is_correct_and_authorized_minter_program_payer_pda
        }
    )]
    pub payer_creator: Signer<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMetaArgs {
    pub update_authority: Pubkey,
    pub name: String,
    pub uri: Url,
    pub mutable: bool,
    pub collection_key: Pubkey,
}

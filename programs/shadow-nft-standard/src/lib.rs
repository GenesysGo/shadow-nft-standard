use anchor_lang::prelude::*;

pub mod common;
pub mod error;
pub mod instructions;

use instructions::{burn::*, create::*, create_collection::*, create_group::*, mint::*, update::*};

declare_id!(shadow_nft_common::STANDARD_PROGRAM);

#[program]
pub mod shadow_nft_standard {

    use super::*;

    /// Instruction to create a metadata account. A `CreatorGroup` and `Collection` must be initialized.
    pub fn create_metadata_account(
        ctx: Context<CreateMetadataAccount>,
        args: CreateMetaArgs,
    ) -> Result<()> {
        handle_create_metadata(ctx, args)
    }

    /// Instruction to mint an NFT. Requires an existing metadata account.
    pub fn mint_nft(ctx: Context<MintNFT>, cost_lamports: u64) -> Result<()> {
        handle_mint(ctx, cost_lamports)
    }

    /// Instruction to update a metadata account. Requires an existing metadata account.
    pub fn update_metadata(ctx: Context<UpdateMetadata>, args: UpdateMetaArgs) -> Result<()> {
        handle_update(ctx, args)
    }

    /// Instruction to burn a metadata account and associated NFT.
    pub fn burn(ctx: Context<Burn>) -> Result<()> {
        handle_burn(ctx)
    }

    // Instruction to create a `CreatorGroup`. Required for creating a collection.
    pub fn create_group(ctx: Context<CreateGroup>, args: CreateGroupArgs) -> Result<()> {
        handle_create_group(ctx, args)
    }

    // Instruction to create a `Collection`. A `CreatorGroup` must be initialized.
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        args: CreateCollectionArgs,
    ) -> Result<()> {
        handle_create_collection(ctx, args)
    }
}

#[macro_export]
macro_rules! verbose_msg {
    ($msg:expr) => {
        #[cfg(feature = "verbose")]
        anchor_lang::solana_program::log::sol_log($msg)
    };
    ($($arg:tt)*) => {
        #[cfg(feature = "verbose")]
        (anchor_lang::solana_program::log::sol_log(&format!($($arg)*)))
    };
}

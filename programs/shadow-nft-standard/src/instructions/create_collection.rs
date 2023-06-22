//! This module contains all code for the `create_group` instruction,
//! which initializes a creator group account.
use anchor_lang::prelude::*;

use crate::{
    common::{
        collection::{Collection, Symbol, MAX_SYMBOL_BYTE_LENGTH},
        creator_group::{CreatorGroup, MAX_GROUP_SIZE},
    },
    error::ErrorCode,
    verbose_msg,
};

/// This handler must verify
/// 1) multisig signatures,
/// 2) symbol size
/// 3) royalty entries
///
/// before initializing the collection value.
pub fn handle_create_collection(
    ctx: Context<CreateCollection>,
    args: CreateCollectionArgs,
) -> Result<()> {
    if !ctx.accounts.creator_group.initialized() {
        return Err(ErrorCode::UnintializedGroup.into());
    }

    // Initialize values only on first signature
    verbose_msg!(
        "Signatures present {}",
        ctx.accounts.collection.sigs.count_ones()
    );
    if ctx.accounts.collection.sigs.count_ones() == 0 {
        // Check symbol length before saving
        let symbol_byte_len = args.symbol.as_bytes().len();
        if symbol_byte_len > MAX_SYMBOL_BYTE_LENGTH {
            return Err(ErrorCode::SymbolToolarge.into());
        }
        ctx.accounts.collection.symbol[..symbol_byte_len].copy_from_slice(args.symbol.as_bytes());

        // Check bps length
        let num_creators = ctx.accounts.creator_group.creators.len();
        if num_creators != args.royalty_50bps.len() {
            verbose_msg!("number of royalty bps entries != number of creators in group");
            return Err(ErrorCode::IncorrectCreatorGroupSize.into());
        }
        // Check bps values
        let total_50bps = args.royalty_50bps.iter().fold(0_u8, |a, b| {
            a.checked_add(*b)
                .expect("Invalid royalties. Must add up to a max of 100%")
        });
        if total_50bps > 200 {
            return Err(ErrorCode::InvalidRoyalties.into());
        }
        ctx.accounts.collection.royalty_50bps[..num_creators].copy_from_slice(&args.royalty_50bps);

        // Save name
        ctx.accounts.collection.name = args.name;

        // Save mint method
        ctx.accounts.collection.for_minter = args.for_minter;

        // Store group key
        ctx.accounts.collection.creator_group_key = ctx.accounts.creator_group.key();

        // Initialize collection size at zero
        ctx.accounts.collection.size = 0;
    }

    // Update signatures (This is idempotent)
    ctx.accounts.collection.sigs |= 1
        << ctx
            .accounts
            .creator_group
            .creators
            .iter()
            .position(|c| c == ctx.accounts.payer_creator.key)
            .unwrap();

    if ctx
        .accounts
        .collection
        .initialized(&ctx.accounts.creator_group.creators)
    {
        // This should take 233 billion years to overflow assuming a collection is created
        // by this group every 400ms
        ctx.accounts.creator_group.num_collections += 1;

        // Truncate name when printing in case it is stupidly large
        verbose_msg!(
            "Created collection {}: {}..",
            &args.symbol,
            &ctx.accounts.collection.name[..32.min(ctx.accounts.collection.name.len())]
        );
    } else {
        verbose_msg!(
            "Creating collection, {}/{} members have signed",
            &ctx.accounts.collection.sigs.count_ones(),
            &ctx.accounts.creator_group.creators.len(),
        );
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    args: CreateCollectionArgs
)]
pub struct CreateCollection<'info> {
    /// The collection account to be initialized
    #[account(
        init_if_needed,
        payer = payer_creator,
        space = {
            const DISCRIMINATOR: usize = 8;
            let group_key = ::core::mem::size_of::<Pubkey>();
            let size = ::core::mem::size_of::<u32>();
            let verified = ::core::mem::size_of::<bool>();
            let symbol = ::core::mem::size_of::<Symbol>();
            let bps = ::core::mem::size_of::<[u8; MAX_GROUP_SIZE]>();
            let name = 4 + args.name.as_bytes().len();
            let for_minter = ::core::mem::size_of::<bool>();

            DISCRIMINATOR + group_key + size + verified + symbol + name + bps + for_minter

        },
        seeds = [
            creator_group.key().as_ref(),
            args.name.as_ref(),
        ],
        bump
    )]
    pub collection: Account<'info, Collection>,

    /// The creator group
    pub creator_group: Account<'info, CreatorGroup>,

    /// A creator within the creator group which is paying to initalize the collection
    #[account(
        mut,
        constraint = creator_group.creators.contains(payer_creator.key)
    )]
    pub payer_creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, Debug, Clone)]
pub struct CreateCollectionArgs {
    /// The name of the collection
    pub name: String,

    /// The symbol for the collection
    pub symbol: String,

    /// Whether the collection will be used with a minter or 1/1s
    pub for_minter: bool,

    /// The royalties for the collection in half-percentages. This must be in
    /// the same order as the creator keys are stored (they are sorted by `Pubkey`).
    ///
    /// Half-percentage are used to maximize the utility of a single `u8`.
    pub royalty_50bps: Vec<u8>,
}

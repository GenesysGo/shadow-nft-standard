use anchor_lang::system_program;
use anchor_lang::{prelude::*, Discriminator};
use shadow_nft_standard::common::collection::Collection;
use shadow_nft_standard::common::creator_group::CreatorGroup;
use shadow_nft_standard::cpi::{create_collection, create_group};
use shadow_nft_standard::instructions::create_collection::CreateCollectionArgs;
use shadow_nft_standard::instructions::create_group::CreateGroupArgs;
use shadow_nft_standard::program::ShadowNftStandard;
use zerocopy_bitslice::ZeroCopyBitSlice;

use crate::state::get_space_for_minter;
use crate::state::uniform_mint::UniformMint;
use crate::{errors::ShadowyError, state::ShadowySuperMinter};

/// This handler must perform many validations and tasks
///
/// 1) Check start and end time are reasonable (e.g. end not in past, end > start)
/// 2) Initialize a ShadowySuperMinter, which holds information about the mint (applicable to all mints)
/// 3) If using an existing creator_group, ensure the creator(s) signed. Otherwise, initialize it.
/// 4) If using an existing collection, ensure it belongs to the creator group. Otherwise, initialize it.
/// 5) Initialize mint info (for now this is just a `UniformMint`, but is made modular to allow for future changes)
/// 6) Initialize a `ZeroCopyBitSlice` to be used for pseudo-random asset selection at mint time.
///
/// If using a multimember group with a pre-initialized `for_minter` collection, only one creator signer
/// is required since all members signed off on the collection knowing it would be used with a minter.
pub fn initialize<'b>(
    ctx: Context<'_, '_, '_, 'b, Initialize<'b>>,
    args: InitializeArgs,
) -> Result<()> {
    // 1) Check time is reasonable
    let clock = Clock::get()?;
    let end_in_past = args.end_time < clock.unix_timestamp;
    let start_after_end = args.start_time >= args.end_time;
    let invalid_times = end_in_past & start_after_end;
    if invalid_times {
        return err!(ShadowyError::InvalidTimes);
    }

    // 2) Initialize shadowy_super_minter
    let shadowy_super_minter_account = &mut ctx.accounts.shadowy_super_minter;
    let shadowy_super_minter_account_info = shadowy_super_minter_account.to_account_info();
    let shadowy_super_minter = ShadowySuperMinter {
        // Inferred fields
        collection: ctx.accounts.collection.key(),
        creator_group: ctx.accounts.creator_group.key(),
        items_redeemed: 0,
        is_mutable: true,

        // Creator specified fields
        items_available: args.items_available,
        price: args.price,
        start_time: args.start_time,
        end_time: args.end_time,
    };

    // Copy discriminator and then initialize cursor for rest of data
    let mut account_data = shadowy_super_minter_account_info.data.borrow_mut();
    account_data[0..8].copy_from_slice(&ShadowySuperMinter::discriminator());
    let mut account_data_cursor = &mut account_data[8..];

    // Write minter
    msg!("cursor has len {}", account_data_cursor.len());
    shadowy_super_minter.serialize(&mut account_data_cursor)?;
    msg!("post ssm cursor len {}", account_data_cursor.len());

    // 3) Init creator group if needed.
    // This also serves as a validation step
    let uninitialized = (ctx.accounts.creator_group.data_len() == 0)
        & ctx.accounts.creator_group.owner.eq(&system_program::ID);
    if uninitialized {
        msg!("CreatorGroup is not initialized. Attempting to initialize.");

        // Build args and get accounts for cpi_ctx
        let cpi_args = CreateGroupArgs {
            name: args.if_init_group_name,
        };
        let create_group_accounts = shadow_nft_standard::cpi::accounts::CreateGroup {
            creator_group: ctx.accounts.creator_group.to_account_info(),
            creator: ctx.accounts.payer_creator.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };

        // Build cpi_ctx and include other creators
        let mut cpi_ctx = CpiContext::new(
            ctx.accounts.shadow_nft_standard_program.to_account_info(),
            create_group_accounts,
        );
        cpi_ctx.remaining_accounts = ctx.remaining_accounts.to_vec();

        // Create group via cpi
        create_group(cpi_ctx, cpi_args)?;
    } else {
        // If this account is already initialized we must validate
        let creator_group_data = ctx.accounts.creator_group.data.borrow();

        // Verify account discriminator
        let correct_discriminator: bool = if creator_group_data.len() >= 8 {
            creator_group_data[0..8].eq(&CreatorGroup::DISCRIMINATOR)
        } else {
            return err!(ShadowyError::InvalidAccount);
        };

        // Verify account owner
        let correct_owner: bool = ctx
            .accounts
            .creator_group
            .owner
            .eq(&shadow_nft_standard::ID);

        // An account is invalid if it has the incorrect discriminator or the incorrect owner
        let invalid_account = (!correct_discriminator) | (!correct_owner);
        if invalid_account {
            return err!(ShadowyError::InvalidAccount);
        }
    }

    // 4) Init collection if needed.
    // This also serves as a validation step
    let uninitialized = (ctx.accounts.collection.data_len() == 0)
        & ctx.accounts.collection.owner.eq(&system_program::ID);
    if uninitialized {
        msg!("Collection is not initialized. Attempting to initialize.");

        // Build args and get accounts for cpi_ctx
        let cpi_args = args
            .if_init_collection
            .ok_or(ShadowyError::InvalidAccount)?;
        let create_group_accounts = shadow_nft_standard::cpi::accounts::CreateCollection {
            creator_group: ctx.accounts.creator_group.to_account_info(),
            payer_creator: ctx.accounts.payer_creator.to_account_info(),
            collection: ctx.accounts.collection.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };

        // Build cpi_ctx, and include other creators
        let mut cpi_ctx = CpiContext::new(
            ctx.accounts.shadow_nft_standard_program.to_account_info(),
            create_group_accounts,
        );
        cpi_ctx.remaining_accounts = ctx.remaining_accounts.to_vec();

        // Create collection via cpi
        create_collection(cpi_ctx, cpi_args)?;
    } else {
        // If this account is already initialized we must validate
        // We have to deserialize in this case to read off value of collection
        let collection_data = ctx.accounts.collection.data.borrow();

        // Return early if there isn't even enough data for discriminator
        if collection_data.len() < 8 {
            return err!(ShadowyError::InvalidAccount);
        }

        // Then, try deserializing
        let collection_account: Collection =
            // This deserialization checks discriminator
            if let Ok(collection) = Collection::try_deserialize(&mut collection_data.as_ref()) {
                collection
            } else {
                return err!(ShadowyError::InvalidAccount);
            };

        // Verify account owner
        let correct_owner: bool = ctx.accounts.collection.owner.eq(&shadow_nft_standard::ID);

        // Verify creator_group
        let correct_group = collection_account
            .creator_group_key
            .eq(ctx.accounts.creator_group.key);

        // Verify it is to be used for_minter
        if !collection_account.for_minter {
            return err!(ShadowyError::CollectionNotForMinter);
        }

        // An account is invalid if it has the incorrect discriminator, the incorrect owner, or the incorrect creator_group
        // (discriminator is checked during deserialization)
        let invalid_account = (!correct_owner) | (!correct_group);
        if invalid_account {
            return err!(ShadowyError::InvalidAccount);
        }
    }

    // 5) Write mint info
    // TODO: extend to nonuniform mints
    args.mint_type.serialize(&mut account_data_cursor)?;
    msg!("post mt cursor len {}", account_data_cursor.len());

    // 6) Initialize `ZeroCopyBitSlice`
    ZeroCopyBitSlice::intialize_in(args.items_available, &mut account_data_cursor);
    msg!("post zcbs cursor len {}", account_data_cursor.len());

    // TODO add mint type to log when we extend to non-uniform mints
    msg!(
        "Initialized a UniformMint using {} bytes",
        account_data.len()
    );

    Ok(())
}

#[derive(Accounts)]
#[instruction(args: InitializeArgs)]
pub struct Initialize<'info> {
    /// CHECK:
    /// Due to the 10KB size limit of system program cpi allocations, this account must be initialized in a
    /// previous instruction. The macro will check that our program is the owner of this account, and that
    /// there is enough space to hold the data we will write in this instruction and in `add_assets`.
    ///
    /// Note that although our program owns this account, it is not a program derived address (PDA). It must
    /// be initialized via `CreateAccountWithSeed`. Using the creator group and the first 32 bytes of the `Pubkey`
    /// string makes this `Pubkey` unique. The string is used, and not the byte array, because the `seed` argument
    /// needs to be a `&str`; Rust requires `&str` be valid utf-8, which we cannot guarantee with any random byte
    /// sequence that makes up a `Pubkey`.
    ///
    /// All in all, the account structure in linear memory to be initialized looks like
    /// [[DISCRIMINANT][SHADOWY SUPER MINTER][MINT TYPE e.g. UNIFORM MINT][ZEROCOPY BITSLICE (if needed)]]
    #[account(
        zero,
        rent_exempt = skip,
        constraint = shadowy_super_minter.to_account_info().owner == program_id
            && shadowy_super_minter.to_account_info().data_len() >= get_space_for_minter(&args.mint_type, args.items_available),
        address = Pubkey::create_with_seed(
            &payer_creator.key(),
            &collection.key().to_string()[0..32],
            &crate::ID,
        ).expect("Failed to derive minter address")
    )]
    pub shadowy_super_minter: UncheckedAccount<'info>,

    /// The `Collection` account which is already initialized, or to be initialized.
    ///
    /// CHECK: account checked in CPI or in `try_deserialize`
    #[account(mut)]
    pub collection: UncheckedAccount<'info>,

    /// The `CreatorGroup` account which is already initialized, or to be initialized.
    ///
    /// CHECK: account checked in CPI or in `try_deserialize`
    #[account(mut)]
    pub creator_group: UncheckedAccount<'info>,

    /// If using a multimember group with a pre-initialized `for_minter` collection, only one creator signer
    /// is required since all members signed off on the collection knowing it would be used with a minter.
    #[account(mut)]
    pub payer_creator: Signer<'info>,

    pub shadow_nft_standard_program: Program<'info, ShadowNftStandard>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, Debug, Clone)]
pub struct InitializeArgs {
    /// Number of items available for minting
    pub items_available: u32,
    /// Mint price
    pub price: u64,
    /// The mint's start time (Solana Cluster Time)
    pub start_time: i64,
    /// The mint's end time (Solana Cluster Time)
    pub end_time: i64,
    // TODO: extend to nonuniform mints
    pub mint_type: UniformMint,
    /// Optional field if initializing collection
    pub if_init_collection: Option<CreateCollectionArgs>,
    /// Optional field if initializing group
    pub if_init_group_name: String,
}

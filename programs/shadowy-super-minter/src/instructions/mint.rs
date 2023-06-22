use std::mem::transmute;

use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::associated_token::AssociatedToken;
use arrayref::array_ref;
use shadow_nft_common::array_from_fn::from_fn;
use shadow_nft_standard::common::calculate_metadata_space;
use shadow_nft_standard::common::creator_group::CreatorGroup;
use shadow_nft_standard::cpi::accounts::CreateMetadataAccount;
use shadow_nft_standard::cpi::accounts::MintNFT;
use shadow_nft_standard::cpi::create_metadata_account;
use shadow_nft_standard::cpi::mint_nft;
use shadow_nft_standard::program::ShadowNftStandard;
use solana_program::{program_pack::Pack, system_instruction};
use zerocopy_bitslice::ZeroCopyBitSlice;

use crate::state::uniform_mint::UniformMint;
use crate::{errors::ShadowyError, state::ShadowySuperMinter};
use shadow_nft_standard::instructions::create::CreateMetaArgs;
use solana_program::sysvar;

use crate::state::spl_token_2022_anchor::Token2022 as Token;

/// This handler must perform many validations and tasks:
///
/// 1) Check the mint has not sold out
/// 2) Check the mint has start and has not ended
/// 3) Generate a pseudorandom seed and select a yet-to-be-minted item pseudorandomly
/// 4) Create the metadata accounut for that asset (including paying rent for it beforehand),
/// initializing the asset mint if needed.
/// 5) Mint the NFT using the newly-initialized metadata account.
/// 6) To accomplish this, an ephemeral `PayerPda` account is initialized at the beginning of the ix
/// and destroyed at the end.
pub fn mint(ctx: Context<Mint>) -> Result<()> {
    // 1) First check whether the mint is sold out
    if ctx.accounts.shadowy_super_minter.items_redeemed
        >= ctx.accounts.shadowy_super_minter.items_available
    {
        return err!(ShadowyError::ShadowySuperMinterEmpty);
    }

    // 2) Then, check that the mint is open (has started, has not ended)
    let clock = Clock::get()?;
    let current_time: i64 = clock.epoch_start_timestamp;
    let mint_has_ended: bool = ctx.accounts.shadowy_super_minter.end_time < current_time;
    let mint_has_not_started: bool = ctx.accounts.shadowy_super_minter.start_time > current_time;
    if mint_has_ended | mint_has_not_started {
        return err!(ShadowyError::InvalidTimes);
    }

    // TODO: are there any other checks we must perform?
    // If we implement whitelists, those checks would go here.

    // 3) Generate a seed for pseudorandom selection
    let recent_slothashes = &ctx.accounts.recent_slothashes;
    let data = recent_slothashes.data.borrow();
    let slot_seed: i64 = i64::from_le_bytes(*array_ref![data, 12, 8]);
    let item_seed: i64 = ctx.accounts.shadowy_super_minter.items_available as i64;
    let time_seed: i64 = clock.unix_timestamp;
    let user_seed: i64 = i64::try_from_slice(&ctx.accounts.minter.key.as_ref()[..8]).unwrap();
    let prng_preseed: [u8; 8] = (slot_seed ^ user_seed)
        .wrapping_add(item_seed)
        .wrapping_add(time_seed)
        .to_le_bytes();
    // SHA256 processes 64 byte blocks so make 8 copies
    let prng_seed: [u8; 64] = from_fn(|i| prng_preseed[i % 8]);

    // Get account data and skip over discriminator, and minter as we've already deserialized it
    let shadowy_super_minter_info = ctx.accounts.shadowy_super_minter.to_account_info();
    let mut account_data = shadowy_super_minter_info.try_borrow_mut_data()?;

    let mut account_data_cursor = &mut account_data[8..];
    msg!("CURSOR LENGTH {}", account_data_cursor.len());
    // Skip minter
    ctx.accounts
        .shadowy_super_minter
        .skip_mut(&mut account_data_cursor);
    msg!("SKIPPED SSM {}", account_data_cursor.len());

    // Grab MintType and ZeroCopyByteSlice
    let mint_type = UniformMint::deserialize(unsafe { transmute(&mut account_data_cursor) })?;
    msg!("DESERED UNIFORM_MINT {}", account_data_cursor.len());
    let mut zcbs = ZeroCopyBitSlice::from_bytes_update(&mut account_data_cursor);
    msg!("DESERED ZCBS {}", account_data_cursor.len());

    // Pick an index and asset
    let index = zcbs
        .choose_random_zero(prng_seed)
        .expect("We have checked that there are assets available");
    let asset = mint_type.asset(index);

    ctx.accounts.shadowy_super_minter.items_redeemed = ctx
        .accounts
        .shadowy_super_minter
        .items_redeemed
        .checked_add(1)
        .ok_or(ShadowyError::NumericalOverflowError)?;
    drop(data);

    // Required for (potentially) initializing several accounts
    let rent = Rent::get()?;

    // 4 (pre-requisite)) Now we need to check to see if we need to initialize the mint account
    if *ctx.accounts.mint.owner == system_program::ID {
        msg!("Initializing mint");
        // Pay rent for mint account
        let pay_rent_and_create_account_ix = system_instruction::create_account(
            ctx.accounts.minter.key,
            ctx.accounts.mint.key,
            rent.minimum_balance(spl_token_2022::state::Mint::LEN),
            spl_token_2022::state::Mint::LEN as u64,
            &spl_token_2022::ID,
        );
        solana_program::program::invoke(
            &pay_rent_and_create_account_ix,
            &[
                ctx.accounts.minter.to_account_info(),
                ctx.accounts.mint.to_account_info(),
            ],
        )?;

        // Initialize the mint account
        let initialize_mint_ix = spl_token_2022::instruction::initialize_mint2(
            ctx.accounts.token_program.key,
            ctx.accounts.mint.key,
            ctx.accounts.metadata.key,
            None,
            0,
        )?;
        solana_program::program::invoke(
            &initialize_mint_ix,
            &[
                ctx.accounts.minter.to_account_info(),
                ctx.accounts.minter_ata.to_account_info(),
                ctx.accounts.minter.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
            ],
        )?;
        msg!("initialized mint");
    }

    // Prior to metadata creation we need the user to pay for space.
    // This allows the `PayerPda` to be a signer for a pda init during cpi.
    let pay_rent_ix = system_instruction::transfer(
        ctx.accounts.minter.key,
        ctx.accounts.metadata.key,
        rent.minimum_balance(calculate_metadata_space(&asset.name, &asset.uri)),
    );
    solana_program::program::invoke(
        &pay_rent_ix,
        &[
            ctx.accounts.minter.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // 4) Now, cpi and create metadata
    let cpi_accounts = CreateMetadataAccount {
        metadata: ctx.accounts.metadata.to_account_info(),
        asset_mint: ctx.accounts.mint.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        creator_group: ctx.accounts.creator_group.to_account_info(),
        collection: ctx.accounts.collection.to_account_info(),
        payer_creator: ctx.accounts.payer_pda.to_account_info(),
    };

    let cpi_program = ctx.accounts.shadow_nft_standard.to_account_info();

    let cpi_seeds: &[&[&[u8]]] = &[&[
        b"payer_pda",
        ctx.accounts.mint.key.as_ref(),
        &[*ctx.bumps.get("payer_pda").unwrap()],
    ]];
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, cpi_seeds);

    let args = CreateMetaArgs {
        update_authority: ctx.accounts.creator_group.key(),
        name: asset.name,
        uri: asset.uri,
        mutable: ctx.accounts.shadowy_super_minter.is_mutable,
        collection_key: ctx.accounts.collection.key(),
    };

    create_metadata_account(cpi_context, args)?;

    // This is used again later when closing account
    let minter_info = ctx.accounts.minter.to_account_info();

    // 5) Mint the NFT
    let cpi_accounts = MintNFT {
        metadata: ctx.accounts.metadata.to_account_info(),
        asset_mint: ctx.accounts.mint.to_account_info(),
        minter: minter_info.clone(),
        token_program: ctx.accounts.token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        minter_ata: ctx.accounts.minter_ata.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
    };

    let cpi_program = ctx.accounts.shadow_nft_standard.to_account_info();

    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    mint_nft(cpi_context, ctx.accounts.shadowy_super_minter.price)?;

    // 6) Close ephemeral payer pda
    let payer_pda_info = ctx.accounts.payer_pda.to_account_info();
    let payer_pda_lamports = payer_pda_info.lamports();
    **payer_pda_info.lamports.borrow_mut() -= payer_pda_lamports;
    **minter_info.lamports.borrow_mut() += payer_pda_lamports;
    payer_pda_info.assign(&system_program::ID);
    payer_pda_info.realloc(0, false)?;

    Ok(())
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    /// An initialized minter account.
    ///
    /// In linear memory looks like
    /// [[DISCRIMINANT][SHADOWY SUPER MINTER][MINT TYPE e.g. UNIFORM MINT][ZEROCOPY BITSLICE]]
    shadowy_super_minter: Box<Account<'info, ShadowySuperMinter>>,

    /// The account which is minting an NFT.
    #[account(mut)]
    minter: Signer<'info>,

    #[account(
        init,
        payer = minter,
        space = 8,
        seeds = [
            b"payer_pda",
            mint.key().as_ref(),
        ],
        bump,
    )]
    payer_pda: Account<'info, PayerPda>,

    /// The minter's associated token account for this NFT.
    /// CHECK: account checked in CPI
    #[account(mut)]
    minter_ata: UncheckedAccount<'info>,

    /// The mint account to be initialized (if needed) during this instruction
    /// CHECK: account checked in CPI
    #[account(mut)]
    mint: Signer<'info>,

    /// The account to be initialized by the standard program
    /// CHECK: account checked in CPI
    #[account(mut)]
    metadata: UncheckedAccount<'info>,

    /// The creator group associated with this collection and NFT.
    #[account(address = shadowy_super_minter.creator_group)]
    creator_group: Account<'info, CreatorGroup>,

    /// The collection associated with this NFT.
    /// CHECK: account checked in CPI
    #[account(mut)]
    collection: UncheckedAccount<'info>,

    /// The standard program
    /// CHECK: account checked in CPI
    shadow_nft_standard: Program<'info, ShadowNftStandard>,

    /// CHECK: account checked in CPI
    token_program: Program<'info, Token>,

    associated_token_program: Program<'info, AssociatedToken>,

    system_program: Program<'info, System>,

    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::slot_hashes::id())]
    recent_slothashes: UncheckedAccount<'info>,
}

/// An ephemeral account to be used to authorize a user to mint an NFT.
/// The standard program checks that the signer is this account.
#[account]
pub struct PayerPda {}

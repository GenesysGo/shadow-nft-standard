use std::str::FromStr;
use std::{error::Error, mem::MaybeUninit};

use crate::{setup, Test, User, CLUSTER, DEVKEY};
use anchor_client::anchor_lang::Discriminator;
use anchor_client::{
    anchor_lang::{AnchorDeserialize, ToAccountMetas},
    solana_sdk::{
        self, native_token::LAMPORTS_PER_SOL, pubkey::Pubkey, signature::Keypair, signer::Signer,
        system_program, transaction::Transaction,
    },
};
use anchor_spl::associated_token;
use shadow_nft_common::payer_pda::get_payer_pda;
use shadow_nft_standard::{
    common::{collection::Collection, get_creator_group_pda, Metadata, Prefix},
    instructions::create_collection::CreateCollectionArgs,
};
use shadowy_super_minter::{
    instructions::InitializeArgs,
    state::{get_space_for_minter, uniform_mint::UniformMint, ShadowySuperMinter},
};
use spl_token_used::solana_program::{self, instruction::Instruction};
use zerocopy_bitslice::ZeroCopyBitSliceRead;

#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{spl_token as spl_token_used, Mint};
#[cfg(feature = "use-token-2022")]
use spl_token_2022::{self as spl_token_used};

const COMPUTE: Pubkey = Pubkey::new_from_array([
    3, 6, 70, 111, 229, 33, 23, 50, 255, 236, 173, 186, 114, 195, 155, 231, 188, 140, 229, 187,
    197, 247, 18, 107, 44, 67, 155, 58, 64, 0, 0, 0,
]);

const START: i64 = 0;
const END: i64 = i64::MAX;
const SYMBOL: &str = "SSM";
const NAME: &str = "Shadowy Super Coders";

pub async fn init_minter<const C: usize>() -> Result<
    (
        Test,
        Pubkey,
        Pubkey,
        Pubkey,
        InitializeArgs,
        [u8; 32],
        Prefix,
    ),
    Box<dyn Error>,
> {
    // Set up environment
    let test: Test = setup(DEVKEY, CLUSTER, shadowy_super_minter::ID);

    // Fund a creator user
    let mut creator_users: [MaybeUninit<User>; C] = [(); C].map(|_| MaybeUninit::uninit());
    for i in 0..C {
        creator_users[i].write(test.fund_user(20 * LAMPORTS_PER_SOL).await?);
    }
    let mut creator_users: [User; C] = creator_users.map(|u| unsafe { u.assume_init() });
    creator_users.sort_by_key(|u| u.pubkey());

    // Get creator_group Pubkey
    let sorted_creator_keys: [Pubkey; C] = std::array::from_fn(|i| creator_users[i].pubkey());
    let creator_group = get_creator_group_pda(&sorted_creator_keys)?;

    // Construct ix args for group
    let prefix_uri = Prefix::ShadowDrive {
        account: Pubkey::from_str("7Ut74FxGz6Msj2b6fux3wGxudVrDkD93en8Q3DRmm5s3").unwrap(),
    };
    let reveal_hash: [u8; 32] = Pubkey::new_unique().to_bytes();
    let args = InitializeArgs {
        price: LAMPORTS_PER_SOL,
        items_available: 5,
        start_time: START,
        end_time: END,
        mint_type: UniformMint {
            reveal_hash,
            name_prefix: NAME.to_string(),
            prefix_uri: prefix_uri.clone(),
        },
        if_init_collection: Some(CreateCollectionArgs {
            for_minter: true,
            symbol: SYMBOL.to_string(),
            name: NAME.to_string(),
            royalty_50bps: vec![1; C],
        }),
        if_init_group_name: "Creatoooors".to_string(),
    };
    let create_minter_args = shadowy_super_minter::instruction::Initialize { args: args.clone() };

    // Get pubkeys of accounts for initialize ix
    let creator = &creator_users[0].keypair;
    let collection = Collection::get_pda(creator_group, NAME);

    let shadowy_super_minter = Pubkey::create_with_seed(
        &creator.pubkey(),
        &collection.to_string()[0..32],
        &shadowy_super_minter::ID,
    )?;

    // Get accounts for initialize ix
    let mut create_minter_accounts = shadowy_super_minter::accounts::Initialize {
        shadowy_super_minter,
        collection,
        creator_group,
        payer_creator: creator.pubkey(),
        shadow_nft_standard_program: shadow_nft_standard::ID,
        system_program: system_program::ID,
    }
    .to_account_metas(None);
    // Regardless of multisig status of group, all creators must sign this particular tx
    for i in 1..C {
        create_minter_accounts.push(solana_sdk::instruction::AccountMeta::new_readonly(
            sorted_creator_keys[i],
            true,
        ));
    }

    // Initialize minter solana account
    let data_len = get_space_for_minter(
        &create_minter_args.args.mint_type,
        create_minter_args.args.items_available,
    );
    let pay_rent_and_create_account_ix = solana_sdk::system_instruction::create_account_with_seed(
        &creator.pubkey(),
        &shadowy_super_minter,
        &creator.pubkey(),
        &collection.to_string()[0..32],
        test.rpc
            .get_minimum_balance_for_rent_exemption(data_len)
            .await?,
        data_len as u64,
        &shadowy_super_minter::ID,
    );

    // Initilaize minter program account
    let initialize_minter_ix = test
        .program
        .request()
        .accounts(create_minter_accounts)
        .args(create_minter_args)
        .instructions()?
        .remove(0);

    // Sign transaction
    //
    // So sad I have to allocate here... newest version of solana-sdk allows for ?Sized types
    let signers: Vec<&dyn Signer> =
        std::array::from_fn::<_, C, _>(|i| &creator_users[i].keypair as &dyn Signer).to_vec();
    let latest_blockhash = test.rpc.get_latest_blockhash().await?;
    let initialize_minter_tx = Transaction::new_signed_with_payer(
        &[pay_rent_and_create_account_ix, initialize_minter_ix],
        Some(&creator.pubkey()),
        &signers,
        latest_blockhash,
    );

    if let Err(e) = test
        .rpc
        .send_and_confirm_transaction(&initialize_minter_tx)
        .await
    {
        panic!("{e:#?}");
    }

    //
    // ONCHAIN DATA VALIDATION
    //

    // Retrieve account data and build a cursor
    let account_data: Vec<u8> = test.rpc.get_account_data(&shadowy_super_minter).await?;
    let account_data_cursor: &mut &[u8] = &mut account_data.as_slice();

    // Validate discriminator and deserialize all structs
    assert_eq!(
        ShadowySuperMinter::DISCRIMINATOR,
        <[u8; 8] as borsh::BorshDeserialize>::deserialize(account_data_cursor)?
    );
    let onchain_shadowy_super_minter = ShadowySuperMinter::deserialize(account_data_cursor)?;
    let onchain_uniform_mint = UniformMint::deserialize(account_data_cursor)?;
    let onchain_zcbs = unsafe { ZeroCopyBitSliceRead::from_bytes(account_data_cursor) };

    // Validate ShadowySuperMinter
    assert_eq!(
        onchain_shadowy_super_minter,
        ShadowySuperMinter {
            creator_group,
            collection,
            items_redeemed: 0,
            is_mutable: true,
            items_available: args.items_available,
            price: args.price,
            start_time: START,
            end_time: END,
        }
    );

    // Validate uniform mint
    assert_eq!(
        onchain_uniform_mint,
        UniformMint {
            reveal_hash,
            name_prefix: NAME.to_string(),
            prefix_uri: prefix_uri.clone(),
        },
    );

    // Validate ZCBS
    assert_eq!(onchain_zcbs.bit_len(), 5);
    assert_eq!(onchain_zcbs.num_zeros(), 5);

    Ok((
        test,
        shadowy_super_minter,
        collection,
        creator_group,
        args,
        reveal_hash,
        prefix_uri,
    ))
}

pub async fn mint_one<const C: usize>() -> Result<(), Box<dyn Error>> {
    let (test, shadowy_super_minter, collection, creator_group, args, reveal_hash, prefix_uri) =
        init_minter::<C>().await?;

    // Some user
    let minter = test.fund_user(5 * LAMPORTS_PER_SOL).await?;

    // Some keypair for the mint of the NFT and metadata
    let nft_mint = Keypair::new();
    let metadata = Metadata::derive_pda(&nft_mint.pubkey());

    // Minter's ata
    let minter_ata = associated_token::get_associated_token_address_with_program_id(
        &minter.pubkey(),
        &nft_mint.pubkey(),
        &spl_token_used::ID,
    );

    // Mint accounts
    let mint_ix_accounts = shadowy_super_minter::accounts::Mint {
        shadowy_super_minter,
        minter: minter.pubkey(),
        payer_pda: get_payer_pda(&nft_mint.pubkey()),
        mint: nft_mint.pubkey(),
        minter_ata,
        metadata,
        collection,
        creator_group,
        associated_token_program: associated_token::ID,
        shadow_nft_standard: shadow_nft_standard::ID,
        token_program: spl_token_used::ID,
        system_program: system_program::ID,
        recent_slothashes: solana_program::sysvar::slot_hashes::ID,
    };

    let mint_tx = test
        .program
        .request()
        .instruction(Instruction::new_with_borsh::<[u8; 5]>(
            COMPUTE,
            &[0x02, 0x00, 0x06, 0x1A, 0x80],
            vec![],
        ))
        .accounts(mint_ix_accounts)
        .args(shadowy_super_minter::instruction::Mint {})
        .signer(&minter.keypair)
        .signer(&nft_mint)
        .signed_transaction()?;

    if let Err(e) = test.rpc.send_and_confirm_transaction(&mint_tx).await {
        panic!("{e:#?}");
    };

    // BEGIN
    // Validate on-chain minter state, user token balance
    //

    // Retrieve account data and build a cursor
    let account_data: Vec<u8> = test.rpc.get_account_data(&shadowy_super_minter).await?;
    let account_data_cursor: &mut &[u8] = &mut account_data.as_slice();

    // Validate discriminator and deserialize all structs
    assert_eq!(
        ShadowySuperMinter::DISCRIMINATOR,
        <[u8; 8] as borsh::BorshDeserialize>::deserialize(account_data_cursor)?
    );
    let onchain_shadowy_super_minter = ShadowySuperMinter::deserialize(account_data_cursor)?;
    let onchain_uniform_mint = UniformMint::deserialize(account_data_cursor)?;
    let onchain_zcbs = unsafe { ZeroCopyBitSliceRead::from_bytes(account_data_cursor) };

    // Validate ShadowySuperMinter
    assert_eq!(
        onchain_shadowy_super_minter,
        ShadowySuperMinter {
            creator_group,
            collection,
            items_redeemed: 1,
            is_mutable: true,
            items_available: args.items_available,
            price: args.price,
            start_time: START,
            end_time: END,
        }
    );

    // Validate uniform mint
    assert_eq!(
        onchain_uniform_mint,
        UniformMint {
            reveal_hash,
            name_prefix: NAME.to_string(),
            prefix_uri: prefix_uri.clone(),
        },
    );

    // Validate ZCBS
    assert_eq!(onchain_zcbs.bit_len(), 5);
    assert_eq!(onchain_zcbs.num_zeros(), 5 - 1);

    // Validate user token account
    let user_token_balance = test.rpc.get_token_account_balance(&minter_ata).await?;
    assert_eq!(user_token_balance.ui_amount_string, "1");

    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_init_minter() -> Result<(), Box<dyn Error>> {
    init_minter::<1>().await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_mint_from_minter() -> Result<(), Box<dyn Error>> {
    mint_one::<1>().await?;
    Ok(())
}

use std::{error::Error, mem::MaybeUninit};

use crate::{setup, Test, User, CLUSTER, DEVKEY};
use anchor_client::{
    anchor_lang::ToAccountMetas,
    solana_sdk::{
        self, native_token::LAMPORTS_PER_SOL, pubkey::Pubkey, signature::Keypair, signer::Signer,
        system_program, transaction::Transaction,
    },
};
use anchor_spl::associated_token;

#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{spl_token as spl_token_used, Mint};
#[cfg(feature = "use-token-2022")]
use spl_token_2022::{self as spl_token_used, solana_program::program_pack::Pack, state::Mint};

use shadow_nft_standard::{
    common::{
        collection::Collection, creator_group::CreatorGroup, get_creator_group_pda, url::Url,
        Metadata, Prefix,
    },
    instructions::{
        create::CreateMetaArgs, create_collection::CreateCollectionArgs,
        create_group::CreateGroupArgs, update::UpdateMetaArgs,
    },
};

const MINT_COST: u64 = LAMPORTS_PER_SOL / 10;

pub async fn create_creator_group<const C: usize>(
) -> Result<(Test, [User; C], Pubkey), Box<dyn Error>> {
    assert!(C > 0, "need at least one creator");

    // Set up environment
    let test = setup(DEVKEY, CLUSTER, shadow_nft_standard::ID);

    // Fund a creator user
    let mut creator_users: [MaybeUninit<User>; C] = [(); C].map(|_| MaybeUninit::uninit());
    for i in 0..C {
        creator_users[i].write(test.fund_user(LAMPORTS_PER_SOL).await?);
    }
    let mut creator_users: [User; C] = creator_users.map(|u| unsafe { u.assume_init() });
    creator_users.sort_by_key(|u| u.pubkey());

    // Construct ix args for group
    let name = "Creatooors".to_string();

    // Users are already sorted
    let sorted_creator_keys: [Pubkey; C] = std::array::from_fn(|i| creator_users[i].pubkey());
    let creator_group = get_creator_group_pda(&sorted_creator_keys)?;

    // All creators must submit a tx
    for (i, creator) in creator_users.iter().enumerate() {
        let create_group_args = shadow_nft_standard::instruction::CreateGroup {
            args: CreateGroupArgs { name: name.clone() },
        };
        let mut create_group_accounts = shadow_nft_standard::accounts::CreateGroup {
            creator_group,
            creator: creator.pubkey(),
            system_program: system_program::ID,
        }
        .to_account_metas(None);
        // Regardless of multisig status of group, all creators must sign this particular tx
        for j in 0..C {
            if j != i {
                create_group_accounts.push(solana_sdk::instruction::AccountMeta::new_readonly(
                    sorted_creator_keys[j],
                    false,
                ));
            }
        }

        // Build create_group ix for group
        let create_group_ix = test
            .program
            .request()
            .args(create_group_args)
            .accounts(create_group_accounts)
            .instructions()?
            .remove(0);

        // Sign and send create_group tx
        let recent_blockhash = test.blockhash().await?;
        let transaction = Transaction::new_signed_with_payer(
            &[create_group_ix],
            Some(&creator.pubkey()),
            &[&creator.keypair],
            // &signers,
            recent_blockhash,
        );
        if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
            panic!("{e:#?}");
        };
    }

    // Validate on-chain data
    let creator_group_account: CreatorGroup = test.program.account(creator_group)?;
    creator_users.sort_by_key(|c| c.pubkey());
    assert_eq!(&creator_group_account.creators, &sorted_creator_keys);
    assert_eq!(creator_group_account.sigs.count_ones(), C as u32);
    assert_eq!(creator_group_account.num_collections, 0);
    assert_eq!(creator_group_account.name, name);

    Ok((test, creator_users, creator_group))
}

pub async fn create_collection<const C: usize>(
) -> Result<(Test, [User; C], Pubkey, Pubkey), Box<dyn Error>> {
    // Initialize a creator group
    let (test, creator_users, creator_group) = create_creator_group::<C>().await?;

    // Build create_collection ix for group
    let collection_name = "ShadowySuperMinters";
    let collection_symbol = "SSM";
    let collection = Collection::get_pda(creator_group, collection_name);
    let royalty_50bps = [2; C];

    // Each creator must submit a tx to fully initialize collection
    for (i, creator) in creator_users.iter().enumerate() {
        let create_collection_args = shadow_nft_standard::instruction::CreateCollection {
            args: CreateCollectionArgs {
                for_minter: false,
                name: collection_name.to_string(),
                symbol: collection_symbol.to_string(),
                royalty_50bps: royalty_50bps.to_vec(),
            },
        };

        let mut create_collection_accounts = shadow_nft_standard::accounts::CreateCollection {
            collection,
            payer_creator: creator.pubkey(),
            creator_group,
            system_program: system_program::ID,
        }
        .to_account_metas(None);
        for j in 0..C {
            if j != i {
                create_collection_accounts.push(
                    solana_sdk::instruction::AccountMeta::new_readonly(
                        creator_users[j].pubkey(),
                        false,
                    ),
                );
            }
        }

        let create_collection_ix = test
            .program
            .request()
            .args(create_collection_args)
            .accounts(create_collection_accounts)
            .instructions()?
            .remove(0);

        // Send create_group tx
        let recent_blockhash = test.blockhash().await?;
        let transaction = Transaction::new_signed_with_payer(
            &[create_collection_ix],
            Some(&creator.pubkey()),
            &[&creator.keypair],
            recent_blockhash,
        );
        if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
            panic!("{e:#?}");
        };
    }

    // Validate on-chain data
    let collection_account: Collection = test.program.account(collection)?;
    assert_eq!(collection_account.creator_group_key, creator_group);
    assert_eq!(&collection_account.name, collection_name);
    assert_eq!(&collection_account.royalty_50bps[..C], &royalty_50bps);
    assert_eq!(collection_account.size, 0);
    assert_eq!(collection_account.symbol.get(), collection_symbol);
    assert_eq!(collection_account.sigs.count_ones(), C as u32);

    Ok((test, creator_users, creator_group, collection))
}
pub async fn create_meta_unit<const C: usize>(
    initially_mutable: bool,
) -> Result<(Test, [User; C], Pubkey, Pubkey, Keypair), Box<dyn Error>> {
    let (test, creators, creator_group, collection) = create_collection::<C>().await?;

    // NFT mint
    let mint_keypair = Keypair::new();
    let mint_pubkey = mint_keypair.pubkey();
    let metadata_pda = Metadata::derive_pda(&mint_pubkey);
    let pay_rent_and_create_account_ix = solana_sdk::system_instruction::create_account(
        &creators[0].pubkey(),
        &mint_keypair.pubkey(),
        test.rpc
            .get_minimum_balance_for_rent_exemption(Mint::LEN)
            .await?,
        Mint::LEN as u64,
        &spl_token_used::ID,
    );
    let init_mint_ix = spl_token_used::instruction::initialize_mint2(
        &spl_token_used::ID,
        &mint_keypair.pubkey(),
        &metadata_pda,
        None,
        0,
    )?;

    // Define metadata
    let item_name = "SSM 1";
    let item_uri = Url {
        prefix: Prefix::ShadowDrive {
            account: Pubkey::new_unique(),
        },
        object: "ssm1.json".into(),
    };
    let create_metadata_args = shadow_nft_standard::instruction::CreateMetadataAccount {
        args: CreateMetaArgs {
            update_authority: creators[0].pubkey(),
            name: item_name.to_string(),
            uri: item_uri.clone(),
            mutable: initially_mutable,
            collection_key: collection,
        },
    };
    let mut create_metadata_accounts = shadow_nft_standard::accounts::CreateMetadataAccount {
        metadata: metadata_pda,
        asset_mint: mint_keypair.pubkey(),
        payer_creator: creators[0].pubkey(),
        collection,
        creator_group,
        token_program: spl_token_used::ID,
        system_program: system_program::ID,
    }
    .to_account_metas(None);
    for i in 1..C {
        create_metadata_accounts.push(solana_sdk::instruction::AccountMeta::new_readonly(
            creators[i].pubkey(),
            true,
        ));
    }
    let create_metadata_ix = test
        .program
        .request()
        .args(create_metadata_args)
        .accounts(create_metadata_accounts)
        .instructions()?
        .remove(0);

    // So sad I have to allocate here... newest version of solana-sdk allows for ?Sized types
    let mut signers: Vec<&dyn Signer> =
        std::array::from_fn::<_, C, _>(|i| &creators[i].keypair as &dyn Signer).to_vec();
    // Also add mint keypair
    signers.push(&mint_keypair);
    let transaction = Transaction::new_signed_with_payer(
        &[
            pay_rent_and_create_account_ix,
            init_mint_ix,
            create_metadata_ix,
        ],
        Some(&creators[0].pubkey()),
        &signers,
        test.blockhash().await?,
    );
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };

    // Validate on-chain metadata
    let metadata_account: Metadata = test.program.account(metadata_pda)?;
    assert_eq!(metadata_account.mint, mint_pubkey);
    assert_eq!(metadata_account.collection_key, collection);
    assert_eq!(metadata_account.mutable, initially_mutable);
    assert!(!metadata_account.post_primary);
    assert_eq!(metadata_account.name, item_name);
    assert_eq!(metadata_account.update_authority, creators[0].pubkey());
    assert_eq!(metadata_account.uri, item_uri);

    // Validate on-chain collection
    let collection_account: Collection = test.program.account(collection)?;
    assert_eq!(collection_account.size, 1);

    Ok((test, creators, creator_group, collection, mint_keypair))
}

pub async fn mint_unit<const C: usize>(
    initially_mutable: bool,
) -> Result<(Test, [User; C], User, Pubkey, Pubkey, Pubkey, Keypair), Box<dyn Error>> {
    let Ok((test, creators, creator_group, collection, mint_keypair)) = create_meta_unit::<C>(initially_mutable, ).await else {
        panic!("create metadata unit test failed");
    };

    // Create a minter user
    let minter_user = test.fund_user(LAMPORTS_PER_SOL).await?;

    // Get the metadata account porgram derived address
    let metadata_pda = Metadata::derive_pda(&mint_keypair.pubkey());

    // Get the minter's associated token account address
    let minter_ata = associated_token::get_associated_token_address_with_program_id(
        &minter_user.pubkey(),
        &mint_keypair.pubkey(),
        &spl_token_used::ID,
    );

    // Build nft mint instruction
    let nft_mint_ix = test
        .program
        .request()
        .args(shadow_nft_standard::instruction::MintNft {
            cost_lamports: MINT_COST,
        })
        .accounts(shadow_nft_standard::accounts::MintNFT {
            metadata: metadata_pda,
            minter: minter_user.pubkey(),
            minter_ata,
            asset_mint: mint_keypair.pubkey(),
            token_program: spl_token_used::ID,
            associated_token_program: associated_token::ID,
            system_program: system_program::ID,
            collection,
        })
        .instructions()?
        .remove(0);

    // Create and sign transaction to mint
    let transaction = Transaction::new_signed_with_payer(
        &[nft_mint_ix],
        Some(&minter_user.pubkey()),
        &[&minter_user.keypair],
        test.blockhash().await?,
    );
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };

    // Validate on-chain data
    let metadata_account: Metadata = test.program.account(metadata_pda)?;
    assert!(metadata_account.post_primary);

    // Validate token balance
    let minter_ata_balance = test.rpc.get_token_account_balance(&minter_ata).await?;
    assert_eq!(minter_ata_balance.amount.parse::<u64>()?, 1);

    Ok((
        test,
        creators,
        minter_user,
        minter_ata,
        creator_group,
        collection,
        mint_keypair,
    ))
}

pub async fn update_unit<const C: usize>(initially_mutable: bool) -> Result<(), Box<dyn Error>> {
    let Ok((test, creators, creator_group, collection, mint_keypair)) = create_meta_unit::<C>(initially_mutable, ).await else {
        panic!("create metadata unit test failed");
    };

    let metadata_pda = Metadata::derive_pda(&mint_keypair.pubkey());

    // Updated metadata fields
    let new_name = "new name who dis";
    let new_uri = Url {
        prefix: Prefix::ShadowDrive {
            account: Pubkey::new_unique(),
        },
        object: "new_object_who_dis.json".to_string(),
    }
    .to_string();
    let new_mutable = false;

    let update_meta_ix = test
        .program
        .request()
        .args(shadow_nft_standard::instruction::UpdateMetadata {
            args: UpdateMetaArgs {
                name: Some(new_name.to_string()),
                uri: Some(new_uri.clone()),
                mutable: Some(new_mutable),
            },
        })
        .accounts(shadow_nft_standard::accounts::UpdateMetadata {
            metadata: metadata_pda,
            update_authority: creators[0].pubkey(),
            asset_mint: mint_keypair.pubkey(),
            creator_group,
            collection,
            system_program: system_program::ID,
        })
        .instructions()?
        .remove(0);

    let transaction = Transaction::new_signed_with_payer(
        &[update_meta_ix],
        Some(&creators[0].pubkey()),
        &[&creators[0].keypair],
        test.blockhash().await?,
    );
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };

    // Validate on-chain data mutation
    let metadata_account: Metadata = test.program.account(metadata_pda)?;
    assert_eq!(metadata_account.mutable, new_mutable);
    assert_eq!(metadata_account.uri.to_string(), new_uri);
    assert_eq!(&metadata_account.name, new_name);

    Ok(())
}

pub async fn burn_unit<const C: usize>(initially_mutable: bool) -> Result<(), Box<dyn Error>> {
    let (test, ___creators, user, user_ata, _creator_group, _collection, mint_keypair) =
        mint_unit::<C>(initially_mutable).await?;

    let metadata_pda = Metadata::derive_pda(&mint_keypair.pubkey());

    let burn_ix = test
        .program
        .request()
        .args(shadow_nft_standard::instruction::Burn {})
        .accounts(shadow_nft_standard::accounts::Burn {
            metadata: metadata_pda,
            asset_mint: mint_keypair.pubkey(),
            owner: user.pubkey(),
            owner_ata: user_ata,
            token_program: spl_token_used::ID,
            system_program: system_program::ID,
        })
        .instructions()?
        .remove(0);

    let transaction = Transaction::new_signed_with_payer(
        &[burn_ix],
        Some(&user.pubkey()),
        &[&user.keypair],
        test.blockhash().await?,
    );
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };

    // Validate metadata account and token account were annihilated
    assert!(test.program.account::<Metadata>(metadata_pda).is_err());
    assert!(test.rpc.get_token_account_balance(&user_ata).await.is_err());

    Ok(())
}

pub async fn withdraw_unit<const C: usize>(initially_mutable: bool) -> Result<(), Box<dyn Error>> {
    let (test, creators, _user, _user_ata, creator_group, collection, _mint_keypair) =
        mint_unit::<C>(initially_mutable).await?;

    let mut accounts = shadow_nft_standard::accounts::Withdraw {
        payer_creator: creators[0].pubkey(),
        collection,
        creator_group,
    }
    .to_account_metas(None);
    for creator in creators.iter().skip(1) {
        accounts.push(solana_sdk::instruction::AccountMeta {
            pubkey: creator.pubkey(),
            is_signer: false,
            is_writable: true,
        })
    }
    let withdraw_ix = test
        .program
        .request()
        .args(shadow_nft_standard::instruction::Withdraw {})
        .accounts(accounts)
        .instructions()?
        .remove(0);

    let transaction = Transaction::new_signed_with_payer(
        &[withdraw_ix],
        Some(&creators[0].pubkey()),
        &[&creators[0].keypair],
        test.blockhash().await?,
    );
    let pre_collection_balance = test.rpc.get_balance(&collection).await?;
    let pre_creator_balance = test.rpc.get_balance(&creators[0].pubkey()).await?;
    let mut pre_others = Vec::with_capacity(C - 1);
    for c in creators.iter().skip(1) {
        pre_others.push(test.rpc.get_balance(&c.pubkey()).await?);
    }
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };
    let post_collection_balance = test.rpc.get_balance(&collection).await?;
    let post_creator_balance = test.rpc.get_balance(&creators[0].pubkey()).await?;
    let mut post_others = Vec::with_capacity(C - 1);
    for c in creators.iter().skip(1) {
        post_others.push(test.rpc.get_balance(&c.pubkey()).await?);
    }
    let remainder = MINT_COST - (MINT_COST / C as u64) * C as u64;
    assert_eq!(
        post_creator_balance,
        pre_creator_balance + MINT_COST / C as u64 - 5000 + remainder
    );
    for (post_other, pre_other) in post_others.into_iter().zip(pre_others) {
        assert_eq!(post_other, pre_other + MINT_COST / C as u64);
    }
    assert_eq!(post_collection_balance, pre_collection_balance - MINT_COST);

    Ok(())
}

#[allow(unused)] // only used for testing
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_create_metadata_1() -> Result<(), Box<dyn Error>> {
    drop(create_meta_unit::<1>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_create_metadata_2_multisig() -> Result<(), Box<dyn Error>> {
    drop(create_meta_unit::<2>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_create_metadata_3_multisig() -> Result<(), Box<dyn Error>> {
    drop(create_meta_unit::<3>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_mint_1() -> Result<(), Box<dyn Error>> {
    drop(mint_unit::<1>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_mint_2_multisig() -> Result<(), Box<dyn Error>> {
    drop(mint_unit::<2>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_mint_3_multisig() -> Result<(), Box<dyn Error>> {
    drop(mint_unit::<3>(true).await?);
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_update_1() -> Result<(), Box<dyn Error>> {
    update_unit::<1>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_update_2_multisig() -> Result<(), Box<dyn Error>> {
    update_unit::<2>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_update_3_multisig() -> Result<(), Box<dyn Error>> {
    update_unit::<3>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_burn_1() -> Result<(), Box<dyn Error>> {
    burn_unit::<1>(true).await?;
    Ok(())
}
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_burn_2_multisig() -> Result<(), Box<dyn Error>> {
    burn_unit::<2>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_burn_3_multisig() -> Result<(), Box<dyn Error>> {
    burn_unit::<3>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_withdraw_1() -> Result<(), Box<dyn Error>> {
    withdraw_unit::<1>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_withdraw_2_multisig() -> Result<(), Box<dyn Error>> {
    withdraw_unit::<2>(true).await?;
    Ok(())
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_withdraw_3_multisig() -> Result<(), Box<dyn Error>> {
    withdraw_unit::<3>(true).await?;
    Ok(())
}

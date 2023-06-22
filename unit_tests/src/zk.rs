#![cfg(feature = "use-token-2022")]

use std::error::Error;

use anchor_client::solana_sdk::{
    self, signature::Keypair, signer::Signer, transaction::Transaction,
};
use anchor_spl::associated_token;
use spl_token_2022::{
    extension::ExtensionType, solana_program::native_token::LAMPORTS_PER_SOL,
    solana_zk_token_sdk::encryption::elgamal::ElGamalKeypair, state::Mint,
};

use crate::{setup, CLUSTER, DEVKEY};

pub async fn zk_ops() -> Result<(), Box<dyn Error>> {
    // Set up environment
    let test = setup(DEVKEY, CLUSTER, shadow_nft_standard::ID);

    // Create a user
    let user = test.fund_user(LAMPORTS_PER_SOL).await?;

    // Token Account Setup
    // 1) create account
    // 2) create token-2022 mint with token-2022 confidential extension
    let mint_keypair = Keypair::new();
    let user_ata =
        associated_token::get_associated_token_address(&user.pubkey(), &mint_keypair.pubkey());
    let user_eg = ElGamalKeypair::new(&user.keypair, &user_ata)?;
    let pay_rent_and_create_account_ix = solana_sdk::system_instruction::create_account(
        &user.pubkey(),
        &mint_keypair.pubkey(),
        test.rpc
            .get_minimum_balance_for_rent_exemption(ExtensionType::get_account_len::<Mint>(&[
                ExtensionType::ConfidentialTransferMint,
            ]))
            .await?,
        ExtensionType::get_account_len::<Mint>(&[ExtensionType::ConfidentialTransferMint]) as u64,
        &spl_token_2022::ID,
    );
    let init_confidential_mint_ix =
        spl_token_2022::extension::confidential_transfer::instruction::initialize_mint(
            &spl_token_2022::ID,
            &mint_keypair.pubkey(),
            Some(user.pubkey()),
            true,
            None,
            Some(user_eg.public.into()),
        )?;

    // Build tx to make mint
    let transaction = Transaction::new_signed_with_payer(
        &[pay_rent_and_create_account_ix, init_confidential_mint_ix],
        Some(&user.pubkey()),
        &[&user.keypair, &mint_keypair],
        test.blockhash().await?,
    );
    if let Err(e) = test.rpc.send_and_confirm_transaction(&transaction).await {
        panic!("{e:#?}");
    };

    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_zk_ops() -> Result<(), Box<dyn Error>> {
    zk_ops().await
}

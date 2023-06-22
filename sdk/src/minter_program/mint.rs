use std::error::Error;
use std::ops::Deref;

use shadow_nft_common::get_payer_pda;
use shadow_nft_standard::common::{token_2022, Metadata};
use shadowy_super_minter::state::file_type::{
    AccountDeserialize, Id, InstructionData, ToAccountMetas,
};
use shadowy_super_minter::state::ShadowySuperMinter;
use shadowy_super_minter::{accounts::Mint as MintAccounts, instruction::Mint as MintInstruction};
use solana_client::rpc_client::RpcClient;
use solana_sdk::signer::Signer;
use solana_sdk::sysvar;
use solana_sdk::{
    instruction::Instruction, pubkey::Pubkey, system_program, transaction::Transaction,
};

pub fn mint<S: Signer, M: Signer>(
    shadowy_super_minter: Pubkey,
    minter: impl Deref<Target = S>,
    asset_mint: impl Deref<Target = M>,
    rpc_url: &str,
) -> Result<Transaction, Box<dyn Error>> {
    // Get mint accounts
    let client = RpcClient::new(rpc_url);
    let ssm = ShadowySuperMinter::try_deserialize(
        &mut client.get_account_data(&shadowy_super_minter)?.as_slice(),
    )?;
    let accounts = MintAccounts {
        shadowy_super_minter,
        collection: ssm.collection,
        minter: minter.deref().pubkey(),
        mint: asset_mint.deref().pubkey(),
        system_program: system_program::ID,
        minter_ata: spl_associated_token_account::get_associated_token_address_with_program_id(
            &minter.deref().pubkey(),
            &asset_mint.deref().pubkey(),
            &token_2022::Token2022::id(),
        ),
        payer_pda: get_payer_pda(&asset_mint.deref().pubkey()),
        metadata: Metadata::derive_pda(&asset_mint.deref().pubkey()),
        creator_group: ssm.creator_group,
        shadow_nft_standard: shadow_nft_standard::ID,
        token_program: token_2022::Token2022::id(),
        associated_token_program: spl_associated_token_account::ID,
        recent_slothashes: sysvar::slot_hashes::ID,
    }
    .to_account_metas(None);

    // Build instruction
    let ix = Instruction {
        program_id: shadowy_super_minter::ID,
        accounts,
        data: MintInstruction {}.data(),
    };

    // Build transaction
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&minter.deref().pubkey()),
        &[
            minter.deref() as &dyn Signer,
            asset_mint.deref() as &dyn Signer,
        ],
        client.get_latest_blockhash()?,
    );

    Ok(tx)
}

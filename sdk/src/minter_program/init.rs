use std::ops::Deref;

use shadowy_super_minter::state::file_type::{InstructionData, ToAccountMetas};
use shadowy_super_minter::state::get_space_for_minter;
use shadowy_super_minter::state::uniform_mint::UniformMint;
use shadowy_super_minter::{
    accounts::Initialize as InitializeAccounts, instruction::Initialize as InitializeInstruction,
    instructions::initialize::InitializeArgs,
};
use solana_sdk::hash::Hash;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signer::Signer,
    system_program,
    transaction::Transaction,
};

// Only to be used with initialized collections and groups
pub fn create_minter<S: Signer>(
    creator_group: Pubkey,
    collection: Pubkey,
    other_creators: &[Pubkey],
    items_available: u32,
    price_lamports: u64,
    start_time: i64,
    end_time: i64,
    mint_type: UniformMint,
    signer: impl Deref<Target = S>,
    recent_blockhash: Hash,
    mininum_rent_balance_for_minter: u64,
) -> Transaction {
    // Get accounts
    let shadowy_super_minter = Pubkey::create_with_seed(
        &signer.deref().pubkey(),
        &collection.to_string()[0..32],
        &shadowy_super_minter::ID,
    )
    .expect("Failed to derive minter address");
    let mut accounts = InitializeAccounts {
        shadowy_super_minter,
        creator_group,
        collection,
        payer_creator: signer.deref().pubkey(),
        shadow_nft_standard_program: shadow_nft_standard::ID,
        system_program: system_program::ID,
    }
    .to_account_metas(None);
    for other_creator in other_creators {
        accounts.push(AccountMeta::new_readonly(*other_creator, false))
    }

    // Build instruction
    let args = InitializeArgs {
        items_available,
        price: price_lamports,
        start_time,
        end_time,
        mint_type,
        if_init_collection: None,
        if_init_group_name: String::new(),
    };
    let data_len = get_space_for_minter(&args.mint_type, args.items_available);
    let ix = Instruction {
        program_id: shadowy_super_minter::ID,
        accounts,
        data: InitializeInstruction { args }.data(),
    };

    // Build init ssm instruction
    let pay_rent_and_create_account_ix = solana_sdk::system_instruction::create_account_with_seed(
        &signer.deref().pubkey(),
        &shadowy_super_minter,
        &signer.deref().pubkey(),
        &collection.to_string()[0..32],
        mininum_rent_balance_for_minter,
        data_len as u64,
        &shadowy_super_minter::ID,
    );

    // Build transaction
    let tx = Transaction::new_signed_with_payer(
        &[pay_rent_and_create_account_ix, ix],
        Some(&signer.deref().pubkey()),
        &[signer.deref()],
        recent_blockhash,
    );

    tx
}

use std::ops::Deref;

use shadow_nft_standard::{
    accounts::CreateGroup as CreateGroupAccounts,
    instruction::CreateGroup as CreateGroupInstruction,
    instructions::create_group::CreateGroupArgs,
};
use shadowy_super_minter::state::file_type::{InstructionData, ToAccountMetas};
use solana_sdk::{
    hash::Hash,
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signer::Signer,
    system_program,
    transaction::Transaction,
};

pub use shadow_nft_standard::common::get_creator_group_pda;

pub fn create_group<S: Signer>(
    name: String,
    creator_group: Pubkey,
    other_creators: &[Pubkey],
    signer: impl Deref<Target = S>,
    recent_blockhash: Hash,
) -> Transaction {
    // Get accounts
    let mut accounts = CreateGroupAccounts {
        creator_group,
        creator: signer.deref().pubkey(),
        system_program: system_program::ID,
    }
    .to_account_metas(None);
    for other_creator in other_creators {
        accounts.push(AccountMeta::new_readonly(*other_creator, false))
    }

    // Build instruction
    let ix = Instruction {
        program_id: shadow_nft_standard::ID,
        accounts,
        data: CreateGroupInstruction {
            args: CreateGroupArgs { name },
        }
        .data(),
    };

    // Build transaction
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&signer.deref().pubkey()),
        &[signer.deref()],
        recent_blockhash,
    );

    tx
}

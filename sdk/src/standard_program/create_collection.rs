use std::ops::Deref;

use shadow_nft_standard::{
    accounts::CreateCollection as CreateCollectionAccounts, common::collection::Collection,
    instruction::CreateCollection as CreateCollectionInstruction,
    instructions::create_collection::CreateCollectionArgs,
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

pub fn create_collection<S: Signer>(
    collection_name: String,
    symbol: String,
    for_minter: bool,
    royalty_50bps: Vec<u8>,
    creator_group: Pubkey,
    other_creators: &[Pubkey],
    signer: impl Deref<Target = S>,
    recent_blockhash: Hash,
) -> Transaction {
    // Get accounts
    let mut accounts = CreateCollectionAccounts {
        collection: Collection::get_pda(creator_group, &collection_name),
        creator_group,
        payer_creator: signer.deref().pubkey(),
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
        data: CreateCollectionInstruction {
            args: CreateCollectionArgs {
                name: collection_name,
                symbol,
                for_minter,
                royalty_50bps,
            },
        }
        .data(),
    };

    // Build and sign transaction
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&signer.deref().pubkey()),
        &[signer.deref()],
        recent_blockhash,
    );

    tx
}

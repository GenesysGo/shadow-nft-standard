use std::ops::Deref;

use shadow_nft_standard::{
    accounts::{CreateMetadataAccount as CreateAccounts, MintNFT as MintNftAccounts},
    common::{token_2022, Metadata, Url},
    instruction::{CreateMetadataAccount as CreateInstruction, MintNft as MintNftInstruction},
    instructions::create::CreateMetaArgs,
};
use shadowy_super_minter::state::file_type::{Id, InstructionData, ToAccountMetas};
use solana_sdk::{
    hash::Hash, instruction::Instruction, pubkey::Pubkey, signature::Keypair, signer::Signer,
    system_program, transaction::Transaction,
};

/// As of this writing, the ix requires all signers present for a single transaction
/// when not minting from a minter. As such, we only implement this to be used with
/// single member groups where the creator is the minter with a 0 SOL cost.
///
/// This is primarily useful for 1/1s and not much else.
pub fn create_meta_and_mint<S: Signer>(
    name: String,
    creator_group: Pubkey,
    collection: Pubkey,
    asset_mint: Keypair,
    update_authority: Pubkey,
    uri: Url,
    mutable: bool,
    signer: impl Deref<Target = S>,
    recent_blockhash: Hash,
) -> Transaction {
    // Get create metadata accounts
    let metadata = Metadata::derive_pda(&asset_mint.pubkey());
    let accounts = CreateAccounts {
        creator_group,
        asset_mint: asset_mint.pubkey(),
        metadata,
        payer_creator: signer.deref().pubkey(),
        system_program: system_program::ID,
        collection,
        token_program: token_2022::Token2022::id(),
    }
    .to_account_metas(None);

    // Build create metadata instruction
    let create_meta_ix = Instruction {
        program_id: shadow_nft_standard::ID,
        accounts,
        data: CreateInstruction {
            args: CreateMetaArgs {
                update_authority,
                name,
                uri,
                mutable,
                collection_key: collection,
            },
        }
        .data(),
    };

    // Get mint accounts
    let accounts = MintNftAccounts {
        metadata,
        minter: signer.deref().pubkey(),
        minter_ata: spl_associated_token_account::get_associated_token_address_with_program_id(
            &signer.deref().pubkey(),
            &asset_mint.pubkey(),
            &token_2022::Token2022::id(),
        ),
        asset_mint: asset_mint.pubkey(),
        token_program: token_2022::Token2022::id(),
        associated_token_program: spl_associated_token_account::ID,
        system_program: system_program::ID,
    }
    .to_account_metas(None);

    // Build mint instruction
    let mint_ix = Instruction {
        program_id: shadow_nft_standard::ID,
        accounts,
        data: MintNftInstruction { cost_lamports: 0 }.data(),
    };

    // Build transaction
    let tx = Transaction::new_signed_with_payer(
        &[create_meta_ix, mint_ix],
        Some(&signer.deref().pubkey()),
        &[signer.deref()],
        recent_blockhash,
    );

    tx
}

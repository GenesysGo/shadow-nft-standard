pub mod collection;
pub mod creator_group;
pub mod metadata;
#[cfg(feature = "use-token-2022")]
pub mod token_2022;
pub mod url;

pub use metadata::*;
pub use url::*;

use crate::{error::ErrorCode, verbose_msg};
use creator_group::MAX_GROUP_SIZE;

use anchor_lang::prelude::*;
#[cfg(not(feature = "use-token-2022"))]
use anchor_spl::token::{spl_token as spl_token_program_used, Mint};

#[cfg(feature = "use-token-2022")]
use {crate::common::token_2022::Mint, spl_token_2022 as spl_token_program_used};

pub(crate) fn check_ata<'info>(
    owner: &Signer<'info>,
    ata: impl ToAccountInfo<'info>,
    mint: &Account<'info, Mint>,
) -> bool {
    anchor_spl::associated_token::get_associated_token_address_with_program_id(
        owner.key,
        &mint.key(),
        &spl_token_program_used::ID,
    ) == ata.to_account_info().key()
}

pub(crate) fn check_multisig(
    creators_in_group: &[Pubkey],
    payer_creator: &Pubkey,
    remaining_accounts: &[AccountInfo<'_>],
) -> Result<()> {
    // Check each creator in group
    for creator in creators_in_group {
        // Payer is signer
        let is_payer_creator_and_signer = payer_creator == creator;

        // Check whether nonpayer is signer
        let is_nonpayer_creator_and_signer = if !is_payer_creator_and_signer {
            remaining_accounts
                .iter()
                .find(|c| *c.key == creator.key())
                .ok_or(ErrorCode::CreatorNotPresentForMultisig)?
                .is_signer
        } else {
            false
        };

        // Check whether creator signed
        let creator_signed = is_payer_creator_and_signer | is_nonpayer_creator_and_signer;

        // Initial creator
        if !creator_signed {
            verbose_msg!("Creator {} did not sign", creator);
            return Err(ErrorCode::CreatorNotSignerForMultisig.into());
        }
    }

    Ok(())
}

pub(crate) fn _get_creator_group_seed(sorted_creator_keys: &[Pubkey]) -> impl AsRef<[u8]> {
    use sha2::{Digest, Sha256};

    // Initialize sha256hash
    let mut seed_gen = Sha256::new();

    // Digest all creators
    for creator in sorted_creator_keys {
        seed_gen.update(creator.as_ref());
    }

    // Finalize sha256 hash
    seed_gen.finalize()
}

// This one is a public function which validates length before getting seed
pub fn get_creator_group_pda(sorted_creator_keys: &[Pubkey]) -> Result<Pubkey> {
    // Validate size
    if sorted_creator_keys.len() > MAX_GROUP_SIZE {
        return Err(ErrorCode::ExceedsMaxGroupSize.into());
    }

    // Generate seed
    let seed = _get_creator_group_seed(sorted_creator_keys);

    // Find and return PDA
    Ok(Pubkey::find_program_address(&[seed.as_ref()], &crate::ID).0)
}

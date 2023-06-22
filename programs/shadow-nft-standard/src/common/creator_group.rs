use crate::error::ErrorCode;
use anchor_lang::prelude::*;

pub(crate) const MAX_GROUP_SIZE: usize = 8;

#[account]
#[derive(Debug, PartialEq)]
pub struct CreatorGroup {
    /// Number of signatures collected
    pub sigs: u8,

    /// Counter keeping track of the number of collections that have been made
    pub num_collections: u64,

    /// The creators that make up this group
    pub creators: Vec<Pubkey>,

    /// The name of the group
    pub name: String,
}

impl CreatorGroup {
    pub fn initialized(&self) -> bool {
        self.sigs.count_ones() == self.creators.len() as u32
    }
}

/// Function which validates number of creators and obtains the creators
/// from a collection of `AccountInfo<'info>`. Only used to derive seeds.
pub fn get_create_group_creators_sorted(
    payer_creator: Pubkey,
    additional_accounts: &[AccountInfo<'_>],
) -> Result<Vec<Pubkey>> {
    // Get number of creators
    // NOTE: if this ix ever changes, this needs to be revisited
    let num_creators = additional_accounts.len() + 1;
    if num_creators > MAX_GROUP_SIZE {
        return Err(ErrorCode::ExceedsMaxGroupSize.into());
    }

    // Exclude group account and system_program
    // NOTE: if this ix ever changes, this needs to be revisited
    let mut creators = Vec::with_capacity(num_creators);

    // Add signing creators
    creators.push(payer_creator);

    // Add other creators
    for other_creator in additional_accounts {
        creators.push(other_creator.key());
    }

    // Sorting creators makes the group unique
    creators.sort();

    Ok(creators)
}

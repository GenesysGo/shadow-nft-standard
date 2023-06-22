use anchor_lang::prelude::*;
use shadow_nft_standard::common::url::Url;

use super::uniform_mint::UniformMint;

#[account]
#[derive(Default, Debug, PartialEq)]
pub struct ShadowySuperMinter {
    // These are to be collected from accounts or set to defaults
    pub creator_group: Pubkey,
    pub collection: Pubkey,
    pub items_redeemed: u32,
    pub is_mutable: bool,

    // These are to be passed in at initialization by a creator
    pub items_available: u32,
    pub price: u64,
    pub start_time: i64,
    pub end_time: i64,
}

/// As of this writing, the SSM struct only had fixed size types.
/// If this changes, we will need to change this to a function w/ dynamic.
pub const SSM_ACCOUNT_SIZE_WITH_DISCRIMINATOR_WITHOUT_ZC_BYTES: usize =
    8 + 32 + 32 + 4 + 1 + 4 + 8 + 8 + 8;

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct Asset {
    pub name: String,
    pub uri: Url,
}

impl ShadowySuperMinter {
    /// Moves the cursor past a `ShadowySuperMinter` in bytes.
    pub(crate) fn skip_mut<'o, 'i>(&self, buf: &'o mut &'i mut [u8]) {
        // # SAFETY:
        //
        // The compiler requires the outer lifetime (i.e. the one pointing to the mut slice)
        // to be as long as the lifetime of the mutable reference to the mut slice. However, the inner
        // `&'a mut` remains a valid mutable reference after the outer reference is dropped.
        let (_smm_bytes, rest): (&'i mut [u8], &'i mut [u8]) = unsafe {
            ::core::mem::transmute(
                // This size includes the discriminator, which we must not include
                buf.split_at_mut(SSM_ACCOUNT_SIZE_WITH_DISCRIMINATOR_WITHOUT_ZC_BYTES - 8),
            )
        };
        *buf = rest;
    }
}

// TODO: extend to NonUniform Mints
pub fn get_space_for_minter(mint_type: &UniformMint, items: u32) -> usize {
    let mint_type_bytes = mint_type.required_space();
    let bitslice_bytes = zerocopy_bitslice::ZeroCopyBitSlice::required_space(items);

    SSM_ACCOUNT_SIZE_WITH_DISCRIMINATOR_WITHOUT_ZC_BYTES + bitslice_bytes + mint_type_bytes
}

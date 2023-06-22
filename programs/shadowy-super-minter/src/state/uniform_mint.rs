use anchor_lang::prelude::*;
use shadow_nft_standard::common::Prefix;

use super::Asset;

#[derive(Debug, PartialEq, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UniformMint {
    pub reveal_hash: [u8; 32],
    pub name_prefix: String,
    pub prefix_uri: Prefix,
}

impl UniformMint {
    /// Calculates the number of bytes required to serialize the `UniformMint`.
    pub fn required_space(&self) -> usize {
        let UniformMint {
            ref reveal_hash,
            ref name_prefix,
            ref prefix_uri,
        } = self;

        // Initialize space with hash len
        let mut space = reveal_hash.len();

        // Add prefix len
        space += 4 + name_prefix.as_bytes().len();

        // Add prefix uri size
        space += prefix_uri.serialized_size();

        space
    }

    /// Builds the asset given the asset index.
    pub(crate) fn asset(&self, idx: u32) -> Asset {
        let name = format!("{} #{idx}", self.name_prefix);
        let uri = &self.prefix_uri + &format!("{idx}.json");
        Asset { uri, name }
    }
}

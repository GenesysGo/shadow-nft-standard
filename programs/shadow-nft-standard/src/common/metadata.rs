use anchor_lang::prelude::*;

use super::url::Url;

#[account]
#[derive(Debug)]
pub struct Metadata {
    /// The spl-token-2022 mint address of the token associated with the NFT
    pub mint: Pubkey,

    /// The pubkey of the upgrade authority of this metadata account
    pub update_authority: Pubkey,

    /// Pubkey of the collection that this asset belongs to.
    ///
    /// Contains information about royalties, creator group, collection size,
    /// the collection symbol, and whether it's verified
    pub collection_key: Pubkey,

    /// Used to discriminate between primary and secondary sales
    pub post_primary: bool,

    /// Marks metadata as mutable or immutable
    pub mutable: bool,

    /// The asset's name
    pub name: String,

    /// Location of the off-chain metadata
    pub uri: Url,
}

impl Metadata {
    pub fn derive_pda(mint: &Pubkey) -> Pubkey {
        Pubkey::find_program_address(&[mint.as_ref()], &crate::ID).0
    }
}

#[rustfmt::skip]
pub fn calculate_metadata_space(name: &str, url: &Url) -> usize {
    8 
        + 32 // mint key
        + 32 // update_authority key
        + 32 // collection key
        + 1 // post primary bool
        + 1 // mutable bool
        + 4 + name.as_bytes().len() //name
        // Url is Prefix + String
        + url.prefix.serialized_size() // prefix
        + 4 + url.object.as_bytes().len() // object
}

#[test]
fn test_calculate_size() {
    use crate::common::Prefix;

    // Names, prefixes, and objects of varying length to test
    const NAMES: &[&str] = &[
        "joel bitin nft",
        "danny tromp nft",
        "",
        "a very pedantic and prolific shadowy super coder that documents their code and writes unit tests",
    ];
    let prefixes = &[
        Prefix::ShadowDrive {
            account: Pubkey::new_unique(),
        },
        Prefix::Arweave,
        Prefix::Other {
            prefix: "https://mygoogledriveaccount.com/thisismygoogledriveaccount/".into(),
        },
        Prefix::Other { prefix: "".into() }, // not a useful example but the space calculation should still work
    ];
    const OBJECTS: &[&str] = &[
        "object.gif",
        "a_very_shiny_new_and_gargantuan_object_with_which_to_make_a_metadata_account.gif",
        "1.jpeg",
        "",
    ];

    for name in NAMES {
        for prefix in prefixes {
            for object in OBJECTS {
                // Construct uri to go in metadata
                let uri = prefix + object;

                // Get metadata account length without discriminator
                const DISCRIMINATOR_LEN: usize = 8;
                let expected_space_without_discriminator =
                    calculate_metadata_space(name, &uri) - DISCRIMINATOR_LEN;

                // Serialize the metadata
                let serialized_meta = Metadata {
                    mint: Pubkey::new_unique(),
                    update_authority: Pubkey::new_unique(),
                    collection_key: Pubkey::new_unique(),
                    post_primary: false,
                    mutable: false,
                    name: name.to_string(),
                    uri,
                }
                .try_to_vec()
                .unwrap();

                // Check serialized size
                assert_eq!(serialized_meta.len(), expected_space_without_discriminator);
            }
        }
    }
}

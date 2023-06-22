use std::{fmt::Display, ops::Add, str::FromStr};

use anchor_lang::prelude::*;
use strum::{EnumIter, IntoStaticStr};

/// The common prefix of a `Url`. This is separated since a minter will hold a common prefix.
#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, Debug, Clone, EnumIter, IntoStaticStr)]
#[repr(u8)]
pub enum Prefix {
    ShadowDrive { account: Pubkey },

    // TODO
    Arweave,

    Other { prefix: String },
}

impl Prefix {
    pub fn serialized_size(&self) -> usize {
        match self {
            Prefix::ShadowDrive { .. } => 1 + 32,
            Prefix::Arweave => 1,
            Prefix::Other { prefix } => 1 + 4 + prefix.as_bytes().len(),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct Url {
    pub prefix: Prefix,
    pub object: String,
}

impl Prefix {
    pub fn new_sdrive(account: Pubkey) -> Prefix {
        Prefix::ShadowDrive { account }
    }
}

impl Add<&str> for Prefix {
    type Output = Url;
    fn add(self, rhs: &str) -> Self::Output {
        Url {
            prefix: self,
            object: rhs.to_string(),
        }
    }
}

impl Add<&str> for &Prefix {
    type Output = Url;
    fn add(self, rhs: &str) -> Self::Output {
        Url {
            prefix: self.clone(),
            object: rhs.to_string(),
        }
    }
}

const SDRIVE_OBJECT_PREFIX: &str = "https://shdw-drive.genesysgo.net";
const ARWEAVE_OBJECT_PREFIX: &str = "TODO";

impl ToString for Url {
    fn to_string(&self) -> String {
        let object = &self.object;
        match &self.prefix {
            Prefix::ShadowDrive { account } => {
                let account_base58 = bs58::encode(account).into_string();
                format!("{SDRIVE_OBJECT_PREFIX}/{account_base58}/{object}")
            }

            Prefix::Arweave => {
                format!("{ARWEAVE_OBJECT_PREFIX}/{object}")
            }

            Prefix::Other { prefix } => format!("{prefix}/{object}"),
        }
    }
}

impl FromStr for Url {
    type Err = &'static str;
    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        msg!("uri string {:?}", s);
        // Handle shadow drive case
        if s.starts_with(SDRIVE_OBJECT_PREFIX) {
            // Get the components, skipping over initial null component
            let mut components = s[SDRIVE_OBJECT_PREFIX.len()..].split('/').skip(1);

            // Try parsing account
            let pubkey_str = components.next().ok_or(INVALID_SHADOW_DRIVE_URL)?;

            let account = Pubkey::from_str(pubkey_str).map_err(|_| INVALID_SHADOW_DRIVE_URL)?;

            // Try parsing object name
            let object = components
                .next()
                .ok_or(INVALID_SHADOW_DRIVE_URL)?
                .to_string();

            return Ok(Url {
                prefix: Prefix::ShadowDrive { account },
                object,
            });
        }

        todo!("handle other cases")
    }
}

pub const INVALID_SHADOW_DRIVE_URL: &str = "Invalid shadow drive url";

/// To be used only for
impl Display for Prefix {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s: &'static str = self.into();
        write!(f, "{}", s)
    }
}

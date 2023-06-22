use std::ops::{Deref, DerefMut};

use anchor_lang::prelude::*;

use super::creator_group::MAX_GROUP_SIZE;

#[account]
#[derive(PartialEq, Debug)]
pub struct Collection {
    /// Pubkey of the creator group that created this collection
    pub creator_group_key: Pubkey,

    /// Number of items in the collection
    pub size: u32,

    /// Signatures indicating whether the collection has been signed by all creators
    pub sigs: u8,

    /// Whether this collection will be minted via minter
    pub for_minter: bool,

    /// Royalty per creator (in half-percentages!). Half-percentages are used
    /// to be able to use a single byte (0 to 255) effectively.
    ///
    /// # Examples
    /// `royalty_50bps_multiplier` = 4
    ///     -> 4 * 0.5% = 2% royalty
    ///
    /// `royalty_50bps_multiplier` = 7
    ///     -> 7 * 0.5% = 3.5% royalty
    ///
    /// The number of nonzero entries must match the number of creators in the creator group.
    /// This should be enforced upon the initialization of a collection.
    pub royalty_50bps: [u8; MAX_GROUP_SIZE],

    /// Symbol for the collection
    pub symbol: Symbol,

    /// Name for the collection
    pub name: String,
}

impl Collection {
    /// Finds the `Pubkey` of the `Collection` for a particular creator group's collection.
    pub fn get_pda(creator_group: Pubkey, collection_name: &str) -> Pubkey {
        Pubkey::find_program_address(
            &[creator_group.as_ref(), collection_name.as_ref()],
            &crate::ID,
        )
        .0
    }

    pub(crate) fn initialized(&self, creators: &[Pubkey]) -> bool {
        self.sigs.count_ones() == creators.len() as u32
    }
}

pub const MAX_SYMBOL_BYTE_LENGTH: usize = 8;

/// Only valid ASCII is allowed
///
/// (TODO: should we extend to all utf-8?)
// #[account]
#[derive(PartialEq, Eq, AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct Symbol {
    inner: [u8; MAX_SYMBOL_BYTE_LENGTH],
}

impl Symbol {
    /// Validates input bytes and returns a new `Symbol`.
    pub fn new(input: impl AsRef<[u8]>) -> std::result::Result<Symbol, SymbolError> {
        // Try to parse input
        let input_data = input.as_ref();
        if input_data.len() > MAX_SYMBOL_BYTE_LENGTH {
            return Err(SymbolError::ExceedsMaxLength);
        }

        // ASCII is a subset of utf-8. If it is not valid utf-8 it is not valid ASCII
        let input_str = core::str::from_utf8(input_data).map_err(|_| SymbolError::InvalidAscii)?;

        // Check for valid uppercase ascii
        let uppercase_ascii = input_str.chars().all(|c| c.is_ascii_uppercase());
        if !uppercase_ascii {
            return Err(SymbolError::IncorrectCaseOrInvalidCharacters);
        }

        // Copy into array
        let mut inner = [0; MAX_SYMBOL_BYTE_LENGTH];
        inner[..input_data.len()].copy_from_slice(input_data);

        Ok(Symbol { inner })
    }

    /// Returns the inner symbol as a `&str`.
    pub fn get(&self) -> &str {
        core::str::from_utf8(&self.inner)
            .expect("should have been checked for valid ASCII")
            .trim_end()
            .trim_end_matches('\0')
    }
}

#[derive(Debug, PartialEq)]
pub enum SymbolError {
    InvalidAscii,
    IncorrectCaseOrInvalidCharacters,
    ExceedsMaxLength,
}

impl Deref for Symbol {
    type Target = [u8];
    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl DerefMut for Symbol {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}

impl std::fmt::Debug for Symbol {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let symbol = core::str::from_utf8(&self.inner)
            .expect("this should have been checked")
            .trim_end()
            .trim_end_matches('\0');
        write!(f, "symbol = {symbol}")
    }
}

#[test]
fn test_symbol_uppercase() {
    let upper_case = "SHDW";
    let symbol = Symbol::new(upper_case).unwrap();
    assert_eq!(symbol.get(), upper_case);

    let upper_case_bytes = b"SHDW";
    let symbol = Symbol::new(upper_case_bytes).unwrap();
    assert_eq!(upper_case_bytes.as_ref(), symbol.get().as_bytes());
}

#[test]
fn test_symbol_lowercase() {
    let lower_case = "shdw";
    assert_eq!(
        Symbol::new(lower_case).unwrap_err(),
        SymbolError::IncorrectCaseOrInvalidCharacters
    );
}

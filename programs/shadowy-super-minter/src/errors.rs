use anchor_lang::prelude::*;

#[error_code]
pub enum ShadowyError {
    #[msg("Account is not initialized")]
    Uninitialized,

    #[msg("Index greater than length")]
    IndexGreaterThanLength,

    #[msg("Numerical overflow error")]
    NumericalOverflowError,

    #[msg("Can only provide up to 4 creators to ssm (because ssm is one)")]
    TooManyCreators,

    #[msg("SSM is empty")]
    ShadowySuperMinterEmpty,

    #[msg("The metadata account has data in it, and this must be empty to mint a new NFT")]
    MetadataAccountMustBeEmpty,

    #[msg("Mint authority provided does not match the authority on the mint")]
    InvalidMintAuthority,

    #[msg("Unable to find an unused asset near your random number index")]
    CannotFindUsableAsset,

    #[msg("Invalid string")]
    InvalidString,

    #[msg(
        "Either the end time you specified for the minter is in the past, \
        or the start time you specified for the minter comes after the end time"
    )]
    InvalidTimes,

    #[msg("The instruction contains an invalid account")]
    InvalidAccount,

    #[msg("This mint has either not yet begun or has already ended")]
    MintNotOpen,

    #[msg("This already-initialized collection is not to be used with a minter")]
    CollectionNotForMinter,
}

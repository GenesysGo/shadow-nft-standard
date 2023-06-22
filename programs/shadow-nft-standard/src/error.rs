use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Mint account has a freeze authority")]
    FreezeAuthorityPresent,

    #[msg("Metadata account must have mint authority")]
    InvalidMintAuthority,

    #[msg("Mint account either has a nonunitary supply or nonzero decimals")]
    DivisibleToken,

    #[msg("Primary sale already occured")]
    PrimarySale,

    #[msg("Insufficient SOL for mint")]
    InsufficientSolForMint,

    #[msg("Unauthorized")]
    Unauthorized,

    #[msg("This metadata accounts is immutable")]
    ImmutableAccount,

    #[msg("The instruction received invalid input")]
    InvalidArguments,

    #[msg("Attempted to create a group which exceeds the maximum number of members")]
    ExceedsMaxGroupSize,

    #[msg("A creator must be a system account")]
    CreatorMustBeSystemAccount,

    #[msg("A creator was not present for a multisig operation")]
    CreatorNotPresentForMultisig,

    #[msg("A creator did not sign for a multisig operation")]
    CreatorNotSignerForMultisig,

    #[msg("A creator was included twice in a group")]
    DuplicateCreator,

    #[msg("The symbol provided is too large")]
    SymbolToolarge,

    #[msg("Incorrect creator group size")]
    IncorrectCreatorGroupSize,

    #[msg("An integer overflowed")]
    IntegerOverflow,

    #[msg("Not all creators have signed to create this group")]
    UnintializedGroup,

    #[msg("Not all creators have signed to create this collection")]
    UnintializedCollection,

    #[msg("The royalties you provided add up to >100%")]
    InvalidRoyalties,
}

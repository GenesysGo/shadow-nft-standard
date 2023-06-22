export type CustomError = FreezeAuthorityPresent | InvalidMintAuthority | DivisibleToken | PrimarySale | InsufficientSolForMint | Unauthorized | ImmutableAccount | InvalidArguments | ExceedsMaxGroupSize | CreatorMustBeSystemAccount | CreatorNotPresentForMultisig | CreatorNotSignerForMultisig | DuplicateCreator | SymbolToolarge | IncorrectCreatorGroupSize | IntegerOverflow | UnintializedGroup | UnintializedCollection | InvalidRoyalties;
export declare class FreezeAuthorityPresent extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6000;
    readonly code = 6000;
    readonly name = "FreezeAuthorityPresent";
    readonly msg = "Mint account has a freeze authority";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidMintAuthority extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6001;
    readonly code = 6001;
    readonly name = "InvalidMintAuthority";
    readonly msg = "Metadata account must have mint authority";
    constructor(logs?: string[] | undefined);
}
export declare class DivisibleToken extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6002;
    readonly code = 6002;
    readonly name = "DivisibleToken";
    readonly msg = "Mint account either has a nonunitary supply or nonzero decimals";
    constructor(logs?: string[] | undefined);
}
export declare class PrimarySale extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6003;
    readonly code = 6003;
    readonly name = "PrimarySale";
    readonly msg = "Primary sale already occured";
    constructor(logs?: string[] | undefined);
}
export declare class InsufficientSolForMint extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6004;
    readonly code = 6004;
    readonly name = "InsufficientSolForMint";
    readonly msg = "Insufficient SOL for mint";
    constructor(logs?: string[] | undefined);
}
export declare class Unauthorized extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6005;
    readonly code = 6005;
    readonly name = "Unauthorized";
    readonly msg = "Unauthorized";
    constructor(logs?: string[] | undefined);
}
export declare class ImmutableAccount extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6006;
    readonly code = 6006;
    readonly name = "ImmutableAccount";
    readonly msg = "This metadata accounts is immutable";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidArguments extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6007;
    readonly code = 6007;
    readonly name = "InvalidArguments";
    readonly msg = "The instruction received invalid input";
    constructor(logs?: string[] | undefined);
}
export declare class ExceedsMaxGroupSize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6008;
    readonly code = 6008;
    readonly name = "ExceedsMaxGroupSize";
    readonly msg = "Attempted to create a group which exceeds the maximum number of members";
    constructor(logs?: string[] | undefined);
}
export declare class CreatorMustBeSystemAccount extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6009;
    readonly code = 6009;
    readonly name = "CreatorMustBeSystemAccount";
    readonly msg = "A creator must be a system account";
    constructor(logs?: string[] | undefined);
}
export declare class CreatorNotPresentForMultisig extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6010;
    readonly code = 6010;
    readonly name = "CreatorNotPresentForMultisig";
    readonly msg = "A creator was not present for a multisig operation";
    constructor(logs?: string[] | undefined);
}
export declare class CreatorNotSignerForMultisig extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6011;
    readonly code = 6011;
    readonly name = "CreatorNotSignerForMultisig";
    readonly msg = "A creator did not sign for a multisig operation";
    constructor(logs?: string[] | undefined);
}
export declare class DuplicateCreator extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6012;
    readonly code = 6012;
    readonly name = "DuplicateCreator";
    readonly msg = "A creator was included twice in a group";
    constructor(logs?: string[] | undefined);
}
export declare class SymbolToolarge extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6013;
    readonly code = 6013;
    readonly name = "SymbolToolarge";
    readonly msg = "The symbol provided is too large";
    constructor(logs?: string[] | undefined);
}
export declare class IncorrectCreatorGroupSize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6014;
    readonly code = 6014;
    readonly name = "IncorrectCreatorGroupSize";
    readonly msg = "Incorrect creator group size";
    constructor(logs?: string[] | undefined);
}
export declare class IntegerOverflow extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6015;
    readonly code = 6015;
    readonly name = "IntegerOverflow";
    readonly msg = "An integer overflowed";
    constructor(logs?: string[] | undefined);
}
export declare class UnintializedGroup extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6016;
    readonly code = 6016;
    readonly name = "UnintializedGroup";
    readonly msg = "Not all creators have signed to create this group";
    constructor(logs?: string[] | undefined);
}
export declare class UnintializedCollection extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6017;
    readonly code = 6017;
    readonly name = "UnintializedCollection";
    readonly msg = "Not all creators have signed to create this collection";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidRoyalties extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6018;
    readonly code = 6018;
    readonly name = "InvalidRoyalties";
    readonly msg = "The royalties you provided add up to >100%";
    constructor(logs?: string[] | undefined);
}
export declare function fromCode(code: number, logs?: string[]): CustomError | null;

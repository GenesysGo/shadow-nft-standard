export type CustomError = Uninitialized | IndexGreaterThanLength | NumericalOverflowError | TooManyCreators | ShadowySuperMinterEmpty | MetadataAccountMustBeEmpty | InvalidMintAuthority | CannotFindUsableAsset | InvalidString | InvalidTimes | InvalidAccount | MintNotOpen | CollectionNotForMinter;
export declare class Uninitialized extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6000;
    readonly code = 6000;
    readonly name = "Uninitialized";
    readonly msg = "Account is not initialized";
    constructor(logs?: string[] | undefined);
}
export declare class IndexGreaterThanLength extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6001;
    readonly code = 6001;
    readonly name = "IndexGreaterThanLength";
    readonly msg = "Index greater than length";
    constructor(logs?: string[] | undefined);
}
export declare class NumericalOverflowError extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6002;
    readonly code = 6002;
    readonly name = "NumericalOverflowError";
    readonly msg = "Numerical overflow error";
    constructor(logs?: string[] | undefined);
}
export declare class TooManyCreators extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6003;
    readonly code = 6003;
    readonly name = "TooManyCreators";
    readonly msg = "Can only provide up to 4 creators to ssm (because ssm is one)";
    constructor(logs?: string[] | undefined);
}
export declare class ShadowySuperMinterEmpty extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6004;
    readonly code = 6004;
    readonly name = "ShadowySuperMinterEmpty";
    readonly msg = "SSM is empty";
    constructor(logs?: string[] | undefined);
}
export declare class MetadataAccountMustBeEmpty extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6005;
    readonly code = 6005;
    readonly name = "MetadataAccountMustBeEmpty";
    readonly msg = "The metadata account has data in it, and this must be empty to mint a new NFT";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidMintAuthority extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6006;
    readonly code = 6006;
    readonly name = "InvalidMintAuthority";
    readonly msg = "Mint authority provided does not match the authority on the mint";
    constructor(logs?: string[] | undefined);
}
export declare class CannotFindUsableAsset extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6007;
    readonly code = 6007;
    readonly name = "CannotFindUsableAsset";
    readonly msg = "Unable to find an unused asset near your random number index";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidString extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6008;
    readonly code = 6008;
    readonly name = "InvalidString";
    readonly msg = "Invalid string";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidTimes extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6009;
    readonly code = 6009;
    readonly name = "InvalidTimes";
    readonly msg = "Either the end time you specified for the minter is in the past,         or the start time you specified for the minter comes after the end time";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidAccount extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6010;
    readonly code = 6010;
    readonly name = "InvalidAccount";
    readonly msg = "The instruction contains an invalid account";
    constructor(logs?: string[] | undefined);
}
export declare class MintNotOpen extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6011;
    readonly code = 6011;
    readonly name = "MintNotOpen";
    readonly msg = "This mint has either not yet begun or has already ended";
    constructor(logs?: string[] | undefined);
}
export declare class CollectionNotForMinter extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 6012;
    readonly code = 6012;
    readonly name = "CollectionNotForMinter";
    readonly msg = "This already-initialized collection is not to be used with a minter";
    constructor(logs?: string[] | undefined);
}
export declare function minterFromCode(code: number, logs?: string[]): CustomError | null;

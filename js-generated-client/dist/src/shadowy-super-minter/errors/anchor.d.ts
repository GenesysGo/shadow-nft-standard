export type AnchorError = InstructionMissing | InstructionFallbackNotFound | InstructionDidNotDeserialize | InstructionDidNotSerialize | IdlInstructionStub | IdlInstructionInvalidProgram | ConstraintMut | ConstraintHasOne | ConstraintSigner | ConstraintRaw | ConstraintOwner | ConstraintRentExempt | ConstraintSeeds | ConstraintExecutable | ConstraintState | ConstraintAssociated | ConstraintAssociatedInit | ConstraintClose | ConstraintAddress | ConstraintZero | ConstraintTokenMint | ConstraintTokenOwner | ConstraintMintMintAuthority | ConstraintMintFreezeAuthority | ConstraintMintDecimals | ConstraintSpace | ConstraintAccountIsNone | RequireViolated | RequireEqViolated | RequireKeysEqViolated | RequireNeqViolated | RequireKeysNeqViolated | RequireGtViolated | RequireGteViolated | AccountDiscriminatorAlreadySet | AccountDiscriminatorNotFound | AccountDiscriminatorMismatch | AccountDidNotDeserialize | AccountDidNotSerialize | AccountNotEnoughKeys | AccountNotMutable | AccountOwnedByWrongProgram | InvalidProgramId | InvalidProgramExecutable | AccountNotSigner | AccountNotSystemOwned | AccountNotInitialized | AccountNotProgramData | AccountNotAssociatedTokenAccount | AccountSysvarMismatch | AccountReallocExceedsLimit | AccountDuplicateReallocs | DeclaredProgramIdMismatch | Deprecated;
export declare class InstructionMissing extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 100;
    readonly code = 100;
    readonly name = "InstructionMissing";
    readonly msg = "8 byte instruction identifier not provided";
    constructor(logs?: string[] | undefined);
}
export declare class InstructionFallbackNotFound extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 101;
    readonly code = 101;
    readonly name = "InstructionFallbackNotFound";
    readonly msg = "Fallback functions are not supported";
    constructor(logs?: string[] | undefined);
}
export declare class InstructionDidNotDeserialize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 102;
    readonly code = 102;
    readonly name = "InstructionDidNotDeserialize";
    readonly msg = "The program could not deserialize the given instruction";
    constructor(logs?: string[] | undefined);
}
export declare class InstructionDidNotSerialize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 103;
    readonly code = 103;
    readonly name = "InstructionDidNotSerialize";
    readonly msg = "The program could not serialize the given instruction";
    constructor(logs?: string[] | undefined);
}
export declare class IdlInstructionStub extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 1000;
    readonly code = 1000;
    readonly name = "IdlInstructionStub";
    readonly msg = "The program was compiled without idl instructions";
    constructor(logs?: string[] | undefined);
}
export declare class IdlInstructionInvalidProgram extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 1001;
    readonly code = 1001;
    readonly name = "IdlInstructionInvalidProgram";
    readonly msg = "The transaction was given an invalid program for the IDL instruction";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintMut extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2000;
    readonly code = 2000;
    readonly name = "ConstraintMut";
    readonly msg = "A mut constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintHasOne extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2001;
    readonly code = 2001;
    readonly name = "ConstraintHasOne";
    readonly msg = "A has one constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintSigner extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2002;
    readonly code = 2002;
    readonly name = "ConstraintSigner";
    readonly msg = "A signer constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintRaw extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2003;
    readonly code = 2003;
    readonly name = "ConstraintRaw";
    readonly msg = "A raw constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintOwner extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2004;
    readonly code = 2004;
    readonly name = "ConstraintOwner";
    readonly msg = "An owner constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintRentExempt extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2005;
    readonly code = 2005;
    readonly name = "ConstraintRentExempt";
    readonly msg = "A rent exemption constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintSeeds extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2006;
    readonly code = 2006;
    readonly name = "ConstraintSeeds";
    readonly msg = "A seeds constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintExecutable extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2007;
    readonly code = 2007;
    readonly name = "ConstraintExecutable";
    readonly msg = "An executable constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintState extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2008;
    readonly code = 2008;
    readonly name = "ConstraintState";
    readonly msg = "Deprecated Error, feel free to replace with something else";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintAssociated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2009;
    readonly code = 2009;
    readonly name = "ConstraintAssociated";
    readonly msg = "An associated constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintAssociatedInit extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2010;
    readonly code = 2010;
    readonly name = "ConstraintAssociatedInit";
    readonly msg = "An associated init constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintClose extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2011;
    readonly code = 2011;
    readonly name = "ConstraintClose";
    readonly msg = "A close constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintAddress extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2012;
    readonly code = 2012;
    readonly name = "ConstraintAddress";
    readonly msg = "An address constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintZero extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2013;
    readonly code = 2013;
    readonly name = "ConstraintZero";
    readonly msg = "Expected zero account discriminant";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintTokenMint extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2014;
    readonly code = 2014;
    readonly name = "ConstraintTokenMint";
    readonly msg = "A token mint constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintTokenOwner extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2015;
    readonly code = 2015;
    readonly name = "ConstraintTokenOwner";
    readonly msg = "A token owner constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintMintMintAuthority extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2016;
    readonly code = 2016;
    readonly name = "ConstraintMintMintAuthority";
    readonly msg = "A mint mint authority constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintMintFreezeAuthority extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2017;
    readonly code = 2017;
    readonly name = "ConstraintMintFreezeAuthority";
    readonly msg = "A mint freeze authority constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintMintDecimals extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2018;
    readonly code = 2018;
    readonly name = "ConstraintMintDecimals";
    readonly msg = "A mint decimals constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintSpace extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2019;
    readonly code = 2019;
    readonly name = "ConstraintSpace";
    readonly msg = "A space constraint was violated";
    constructor(logs?: string[] | undefined);
}
export declare class ConstraintAccountIsNone extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2020;
    readonly code = 2020;
    readonly name = "ConstraintAccountIsNone";
    readonly msg = "A required account for the constraint is None";
    constructor(logs?: string[] | undefined);
}
export declare class RequireViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2500;
    readonly code = 2500;
    readonly name = "RequireViolated";
    readonly msg = "A require expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireEqViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2501;
    readonly code = 2501;
    readonly name = "RequireEqViolated";
    readonly msg = "A require_eq expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireKeysEqViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2502;
    readonly code = 2502;
    readonly name = "RequireKeysEqViolated";
    readonly msg = "A require_keys_eq expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireNeqViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2503;
    readonly code = 2503;
    readonly name = "RequireNeqViolated";
    readonly msg = "A require_neq expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireKeysNeqViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2504;
    readonly code = 2504;
    readonly name = "RequireKeysNeqViolated";
    readonly msg = "A require_keys_neq expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireGtViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2505;
    readonly code = 2505;
    readonly name = "RequireGtViolated";
    readonly msg = "A require_gt expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class RequireGteViolated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 2506;
    readonly code = 2506;
    readonly name = "RequireGteViolated";
    readonly msg = "A require_gte expression was violated";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDiscriminatorAlreadySet extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3000;
    readonly code = 3000;
    readonly name = "AccountDiscriminatorAlreadySet";
    readonly msg = "The account discriminator was already set on this account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDiscriminatorNotFound extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3001;
    readonly code = 3001;
    readonly name = "AccountDiscriminatorNotFound";
    readonly msg = "No 8 byte discriminator was found on the account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDiscriminatorMismatch extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3002;
    readonly code = 3002;
    readonly name = "AccountDiscriminatorMismatch";
    readonly msg = "8 byte discriminator did not match what was expected";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDidNotDeserialize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3003;
    readonly code = 3003;
    readonly name = "AccountDidNotDeserialize";
    readonly msg = "Failed to deserialize the account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDidNotSerialize extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3004;
    readonly code = 3004;
    readonly name = "AccountDidNotSerialize";
    readonly msg = "Failed to serialize the account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotEnoughKeys extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3005;
    readonly code = 3005;
    readonly name = "AccountNotEnoughKeys";
    readonly msg = "Not enough account keys given to the instruction";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotMutable extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3006;
    readonly code = 3006;
    readonly name = "AccountNotMutable";
    readonly msg = "The given account is not mutable";
    constructor(logs?: string[] | undefined);
}
export declare class AccountOwnedByWrongProgram extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3007;
    readonly code = 3007;
    readonly name = "AccountOwnedByWrongProgram";
    readonly msg = "The given account is owned by a different program than expected";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidProgramId extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3008;
    readonly code = 3008;
    readonly name = "InvalidProgramId";
    readonly msg = "Program ID was not as expected";
    constructor(logs?: string[] | undefined);
}
export declare class InvalidProgramExecutable extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3009;
    readonly code = 3009;
    readonly name = "InvalidProgramExecutable";
    readonly msg = "Program account is not executable";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotSigner extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3010;
    readonly code = 3010;
    readonly name = "AccountNotSigner";
    readonly msg = "The given account did not sign";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotSystemOwned extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3011;
    readonly code = 3011;
    readonly name = "AccountNotSystemOwned";
    readonly msg = "The given account is not owned by the system program";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotInitialized extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3012;
    readonly code = 3012;
    readonly name = "AccountNotInitialized";
    readonly msg = "The program expected this account to be already initialized";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotProgramData extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3013;
    readonly code = 3013;
    readonly name = "AccountNotProgramData";
    readonly msg = "The given account is not a program data account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountNotAssociatedTokenAccount extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3014;
    readonly code = 3014;
    readonly name = "AccountNotAssociatedTokenAccount";
    readonly msg = "The given account is not the associated token account";
    constructor(logs?: string[] | undefined);
}
export declare class AccountSysvarMismatch extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3015;
    readonly code = 3015;
    readonly name = "AccountSysvarMismatch";
    readonly msg = "The given public key does not match the required sysvar";
    constructor(logs?: string[] | undefined);
}
export declare class AccountReallocExceedsLimit extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3016;
    readonly code = 3016;
    readonly name = "AccountReallocExceedsLimit";
    readonly msg = "The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit";
    constructor(logs?: string[] | undefined);
}
export declare class AccountDuplicateReallocs extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 3017;
    readonly code = 3017;
    readonly name = "AccountDuplicateReallocs";
    readonly msg = "The account was duplicated for more than one reallocation";
    constructor(logs?: string[] | undefined);
}
export declare class DeclaredProgramIdMismatch extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 4100;
    readonly code = 4100;
    readonly name = "DeclaredProgramIdMismatch";
    readonly msg = "The declared program id does not match the actual program id";
    constructor(logs?: string[] | undefined);
}
export declare class Deprecated extends Error {
    readonly logs?: string[] | undefined;
    static readonly code = 5000;
    readonly code = 5000;
    readonly name = "Deprecated";
    readonly msg = "The API being used is deprecated and should no longer be used";
    constructor(logs?: string[] | undefined);
}
export declare function minterFromCode(code: number, logs?: string[]): AnchorError | null;

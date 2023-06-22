"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSysvarMismatch = exports.AccountNotAssociatedTokenAccount = exports.AccountNotProgramData = exports.AccountNotInitialized = exports.AccountNotSystemOwned = exports.AccountNotSigner = exports.InvalidProgramExecutable = exports.InvalidProgramId = exports.AccountOwnedByWrongProgram = exports.AccountNotMutable = exports.AccountNotEnoughKeys = exports.AccountDidNotSerialize = exports.AccountDidNotDeserialize = exports.AccountDiscriminatorMismatch = exports.AccountDiscriminatorNotFound = exports.AccountDiscriminatorAlreadySet = exports.RequireGteViolated = exports.RequireGtViolated = exports.RequireKeysNeqViolated = exports.RequireNeqViolated = exports.RequireKeysEqViolated = exports.RequireEqViolated = exports.RequireViolated = exports.ConstraintAccountIsNone = exports.ConstraintSpace = exports.ConstraintMintDecimals = exports.ConstraintMintFreezeAuthority = exports.ConstraintMintMintAuthority = exports.ConstraintTokenOwner = exports.ConstraintTokenMint = exports.ConstraintZero = exports.ConstraintAddress = exports.ConstraintClose = exports.ConstraintAssociatedInit = exports.ConstraintAssociated = exports.ConstraintState = exports.ConstraintExecutable = exports.ConstraintSeeds = exports.ConstraintRentExempt = exports.ConstraintOwner = exports.ConstraintRaw = exports.ConstraintSigner = exports.ConstraintHasOne = exports.ConstraintMut = exports.IdlInstructionInvalidProgram = exports.IdlInstructionStub = exports.InstructionDidNotSerialize = exports.InstructionDidNotDeserialize = exports.InstructionFallbackNotFound = exports.InstructionMissing = void 0;
exports.fromCode = exports.Deprecated = exports.DeclaredProgramIdMismatch = exports.AccountDuplicateReallocs = exports.AccountReallocExceedsLimit = void 0;
class InstructionMissing extends Error {
    constructor(logs) {
        super("100: 8 byte instruction identifier not provided");
        this.logs = logs;
        this.code = 100;
        this.name = "InstructionMissing";
        this.msg = "8 byte instruction identifier not provided";
    }
}
exports.InstructionMissing = InstructionMissing;
InstructionMissing.code = 100;
class InstructionFallbackNotFound extends Error {
    constructor(logs) {
        super("101: Fallback functions are not supported");
        this.logs = logs;
        this.code = 101;
        this.name = "InstructionFallbackNotFound";
        this.msg = "Fallback functions are not supported";
    }
}
exports.InstructionFallbackNotFound = InstructionFallbackNotFound;
InstructionFallbackNotFound.code = 101;
class InstructionDidNotDeserialize extends Error {
    constructor(logs) {
        super("102: The program could not deserialize the given instruction");
        this.logs = logs;
        this.code = 102;
        this.name = "InstructionDidNotDeserialize";
        this.msg = "The program could not deserialize the given instruction";
    }
}
exports.InstructionDidNotDeserialize = InstructionDidNotDeserialize;
InstructionDidNotDeserialize.code = 102;
class InstructionDidNotSerialize extends Error {
    constructor(logs) {
        super("103: The program could not serialize the given instruction");
        this.logs = logs;
        this.code = 103;
        this.name = "InstructionDidNotSerialize";
        this.msg = "The program could not serialize the given instruction";
    }
}
exports.InstructionDidNotSerialize = InstructionDidNotSerialize;
InstructionDidNotSerialize.code = 103;
class IdlInstructionStub extends Error {
    constructor(logs) {
        super("1000: The program was compiled without idl instructions");
        this.logs = logs;
        this.code = 1000;
        this.name = "IdlInstructionStub";
        this.msg = "The program was compiled without idl instructions";
    }
}
exports.IdlInstructionStub = IdlInstructionStub;
IdlInstructionStub.code = 1000;
class IdlInstructionInvalidProgram extends Error {
    constructor(logs) {
        super("1001: The transaction was given an invalid program for the IDL instruction");
        this.logs = logs;
        this.code = 1001;
        this.name = "IdlInstructionInvalidProgram";
        this.msg = "The transaction was given an invalid program for the IDL instruction";
    }
}
exports.IdlInstructionInvalidProgram = IdlInstructionInvalidProgram;
IdlInstructionInvalidProgram.code = 1001;
class ConstraintMut extends Error {
    constructor(logs) {
        super("2000: A mut constraint was violated");
        this.logs = logs;
        this.code = 2000;
        this.name = "ConstraintMut";
        this.msg = "A mut constraint was violated";
    }
}
exports.ConstraintMut = ConstraintMut;
ConstraintMut.code = 2000;
class ConstraintHasOne extends Error {
    constructor(logs) {
        super("2001: A has one constraint was violated");
        this.logs = logs;
        this.code = 2001;
        this.name = "ConstraintHasOne";
        this.msg = "A has one constraint was violated";
    }
}
exports.ConstraintHasOne = ConstraintHasOne;
ConstraintHasOne.code = 2001;
class ConstraintSigner extends Error {
    constructor(logs) {
        super("2002: A signer constraint was violated");
        this.logs = logs;
        this.code = 2002;
        this.name = "ConstraintSigner";
        this.msg = "A signer constraint was violated";
    }
}
exports.ConstraintSigner = ConstraintSigner;
ConstraintSigner.code = 2002;
class ConstraintRaw extends Error {
    constructor(logs) {
        super("2003: A raw constraint was violated");
        this.logs = logs;
        this.code = 2003;
        this.name = "ConstraintRaw";
        this.msg = "A raw constraint was violated";
    }
}
exports.ConstraintRaw = ConstraintRaw;
ConstraintRaw.code = 2003;
class ConstraintOwner extends Error {
    constructor(logs) {
        super("2004: An owner constraint was violated");
        this.logs = logs;
        this.code = 2004;
        this.name = "ConstraintOwner";
        this.msg = "An owner constraint was violated";
    }
}
exports.ConstraintOwner = ConstraintOwner;
ConstraintOwner.code = 2004;
class ConstraintRentExempt extends Error {
    constructor(logs) {
        super("2005: A rent exemption constraint was violated");
        this.logs = logs;
        this.code = 2005;
        this.name = "ConstraintRentExempt";
        this.msg = "A rent exemption constraint was violated";
    }
}
exports.ConstraintRentExempt = ConstraintRentExempt;
ConstraintRentExempt.code = 2005;
class ConstraintSeeds extends Error {
    constructor(logs) {
        super("2006: A seeds constraint was violated");
        this.logs = logs;
        this.code = 2006;
        this.name = "ConstraintSeeds";
        this.msg = "A seeds constraint was violated";
    }
}
exports.ConstraintSeeds = ConstraintSeeds;
ConstraintSeeds.code = 2006;
class ConstraintExecutable extends Error {
    constructor(logs) {
        super("2007: An executable constraint was violated");
        this.logs = logs;
        this.code = 2007;
        this.name = "ConstraintExecutable";
        this.msg = "An executable constraint was violated";
    }
}
exports.ConstraintExecutable = ConstraintExecutable;
ConstraintExecutable.code = 2007;
class ConstraintState extends Error {
    constructor(logs) {
        super("2008: Deprecated Error, feel free to replace with something else");
        this.logs = logs;
        this.code = 2008;
        this.name = "ConstraintState";
        this.msg = "Deprecated Error, feel free to replace with something else";
    }
}
exports.ConstraintState = ConstraintState;
ConstraintState.code = 2008;
class ConstraintAssociated extends Error {
    constructor(logs) {
        super("2009: An associated constraint was violated");
        this.logs = logs;
        this.code = 2009;
        this.name = "ConstraintAssociated";
        this.msg = "An associated constraint was violated";
    }
}
exports.ConstraintAssociated = ConstraintAssociated;
ConstraintAssociated.code = 2009;
class ConstraintAssociatedInit extends Error {
    constructor(logs) {
        super("2010: An associated init constraint was violated");
        this.logs = logs;
        this.code = 2010;
        this.name = "ConstraintAssociatedInit";
        this.msg = "An associated init constraint was violated";
    }
}
exports.ConstraintAssociatedInit = ConstraintAssociatedInit;
ConstraintAssociatedInit.code = 2010;
class ConstraintClose extends Error {
    constructor(logs) {
        super("2011: A close constraint was violated");
        this.logs = logs;
        this.code = 2011;
        this.name = "ConstraintClose";
        this.msg = "A close constraint was violated";
    }
}
exports.ConstraintClose = ConstraintClose;
ConstraintClose.code = 2011;
class ConstraintAddress extends Error {
    constructor(logs) {
        super("2012: An address constraint was violated");
        this.logs = logs;
        this.code = 2012;
        this.name = "ConstraintAddress";
        this.msg = "An address constraint was violated";
    }
}
exports.ConstraintAddress = ConstraintAddress;
ConstraintAddress.code = 2012;
class ConstraintZero extends Error {
    constructor(logs) {
        super("2013: Expected zero account discriminant");
        this.logs = logs;
        this.code = 2013;
        this.name = "ConstraintZero";
        this.msg = "Expected zero account discriminant";
    }
}
exports.ConstraintZero = ConstraintZero;
ConstraintZero.code = 2013;
class ConstraintTokenMint extends Error {
    constructor(logs) {
        super("2014: A token mint constraint was violated");
        this.logs = logs;
        this.code = 2014;
        this.name = "ConstraintTokenMint";
        this.msg = "A token mint constraint was violated";
    }
}
exports.ConstraintTokenMint = ConstraintTokenMint;
ConstraintTokenMint.code = 2014;
class ConstraintTokenOwner extends Error {
    constructor(logs) {
        super("2015: A token owner constraint was violated");
        this.logs = logs;
        this.code = 2015;
        this.name = "ConstraintTokenOwner";
        this.msg = "A token owner constraint was violated";
    }
}
exports.ConstraintTokenOwner = ConstraintTokenOwner;
ConstraintTokenOwner.code = 2015;
class ConstraintMintMintAuthority extends Error {
    constructor(logs) {
        super("2016: A mint mint authority constraint was violated");
        this.logs = logs;
        this.code = 2016;
        this.name = "ConstraintMintMintAuthority";
        this.msg = "A mint mint authority constraint was violated";
    }
}
exports.ConstraintMintMintAuthority = ConstraintMintMintAuthority;
ConstraintMintMintAuthority.code = 2016;
class ConstraintMintFreezeAuthority extends Error {
    constructor(logs) {
        super("2017: A mint freeze authority constraint was violated");
        this.logs = logs;
        this.code = 2017;
        this.name = "ConstraintMintFreezeAuthority";
        this.msg = "A mint freeze authority constraint was violated";
    }
}
exports.ConstraintMintFreezeAuthority = ConstraintMintFreezeAuthority;
ConstraintMintFreezeAuthority.code = 2017;
class ConstraintMintDecimals extends Error {
    constructor(logs) {
        super("2018: A mint decimals constraint was violated");
        this.logs = logs;
        this.code = 2018;
        this.name = "ConstraintMintDecimals";
        this.msg = "A mint decimals constraint was violated";
    }
}
exports.ConstraintMintDecimals = ConstraintMintDecimals;
ConstraintMintDecimals.code = 2018;
class ConstraintSpace extends Error {
    constructor(logs) {
        super("2019: A space constraint was violated");
        this.logs = logs;
        this.code = 2019;
        this.name = "ConstraintSpace";
        this.msg = "A space constraint was violated";
    }
}
exports.ConstraintSpace = ConstraintSpace;
ConstraintSpace.code = 2019;
class ConstraintAccountIsNone extends Error {
    constructor(logs) {
        super("2020: A required account for the constraint is None");
        this.logs = logs;
        this.code = 2020;
        this.name = "ConstraintAccountIsNone";
        this.msg = "A required account for the constraint is None";
    }
}
exports.ConstraintAccountIsNone = ConstraintAccountIsNone;
ConstraintAccountIsNone.code = 2020;
class RequireViolated extends Error {
    constructor(logs) {
        super("2500: A require expression was violated");
        this.logs = logs;
        this.code = 2500;
        this.name = "RequireViolated";
        this.msg = "A require expression was violated";
    }
}
exports.RequireViolated = RequireViolated;
RequireViolated.code = 2500;
class RequireEqViolated extends Error {
    constructor(logs) {
        super("2501: A require_eq expression was violated");
        this.logs = logs;
        this.code = 2501;
        this.name = "RequireEqViolated";
        this.msg = "A require_eq expression was violated";
    }
}
exports.RequireEqViolated = RequireEqViolated;
RequireEqViolated.code = 2501;
class RequireKeysEqViolated extends Error {
    constructor(logs) {
        super("2502: A require_keys_eq expression was violated");
        this.logs = logs;
        this.code = 2502;
        this.name = "RequireKeysEqViolated";
        this.msg = "A require_keys_eq expression was violated";
    }
}
exports.RequireKeysEqViolated = RequireKeysEqViolated;
RequireKeysEqViolated.code = 2502;
class RequireNeqViolated extends Error {
    constructor(logs) {
        super("2503: A require_neq expression was violated");
        this.logs = logs;
        this.code = 2503;
        this.name = "RequireNeqViolated";
        this.msg = "A require_neq expression was violated";
    }
}
exports.RequireNeqViolated = RequireNeqViolated;
RequireNeqViolated.code = 2503;
class RequireKeysNeqViolated extends Error {
    constructor(logs) {
        super("2504: A require_keys_neq expression was violated");
        this.logs = logs;
        this.code = 2504;
        this.name = "RequireKeysNeqViolated";
        this.msg = "A require_keys_neq expression was violated";
    }
}
exports.RequireKeysNeqViolated = RequireKeysNeqViolated;
RequireKeysNeqViolated.code = 2504;
class RequireGtViolated extends Error {
    constructor(logs) {
        super("2505: A require_gt expression was violated");
        this.logs = logs;
        this.code = 2505;
        this.name = "RequireGtViolated";
        this.msg = "A require_gt expression was violated";
    }
}
exports.RequireGtViolated = RequireGtViolated;
RequireGtViolated.code = 2505;
class RequireGteViolated extends Error {
    constructor(logs) {
        super("2506: A require_gte expression was violated");
        this.logs = logs;
        this.code = 2506;
        this.name = "RequireGteViolated";
        this.msg = "A require_gte expression was violated";
    }
}
exports.RequireGteViolated = RequireGteViolated;
RequireGteViolated.code = 2506;
class AccountDiscriminatorAlreadySet extends Error {
    constructor(logs) {
        super("3000: The account discriminator was already set on this account");
        this.logs = logs;
        this.code = 3000;
        this.name = "AccountDiscriminatorAlreadySet";
        this.msg = "The account discriminator was already set on this account";
    }
}
exports.AccountDiscriminatorAlreadySet = AccountDiscriminatorAlreadySet;
AccountDiscriminatorAlreadySet.code = 3000;
class AccountDiscriminatorNotFound extends Error {
    constructor(logs) {
        super("3001: No 8 byte discriminator was found on the account");
        this.logs = logs;
        this.code = 3001;
        this.name = "AccountDiscriminatorNotFound";
        this.msg = "No 8 byte discriminator was found on the account";
    }
}
exports.AccountDiscriminatorNotFound = AccountDiscriminatorNotFound;
AccountDiscriminatorNotFound.code = 3001;
class AccountDiscriminatorMismatch extends Error {
    constructor(logs) {
        super("3002: 8 byte discriminator did not match what was expected");
        this.logs = logs;
        this.code = 3002;
        this.name = "AccountDiscriminatorMismatch";
        this.msg = "8 byte discriminator did not match what was expected";
    }
}
exports.AccountDiscriminatorMismatch = AccountDiscriminatorMismatch;
AccountDiscriminatorMismatch.code = 3002;
class AccountDidNotDeserialize extends Error {
    constructor(logs) {
        super("3003: Failed to deserialize the account");
        this.logs = logs;
        this.code = 3003;
        this.name = "AccountDidNotDeserialize";
        this.msg = "Failed to deserialize the account";
    }
}
exports.AccountDidNotDeserialize = AccountDidNotDeserialize;
AccountDidNotDeserialize.code = 3003;
class AccountDidNotSerialize extends Error {
    constructor(logs) {
        super("3004: Failed to serialize the account");
        this.logs = logs;
        this.code = 3004;
        this.name = "AccountDidNotSerialize";
        this.msg = "Failed to serialize the account";
    }
}
exports.AccountDidNotSerialize = AccountDidNotSerialize;
AccountDidNotSerialize.code = 3004;
class AccountNotEnoughKeys extends Error {
    constructor(logs) {
        super("3005: Not enough account keys given to the instruction");
        this.logs = logs;
        this.code = 3005;
        this.name = "AccountNotEnoughKeys";
        this.msg = "Not enough account keys given to the instruction";
    }
}
exports.AccountNotEnoughKeys = AccountNotEnoughKeys;
AccountNotEnoughKeys.code = 3005;
class AccountNotMutable extends Error {
    constructor(logs) {
        super("3006: The given account is not mutable");
        this.logs = logs;
        this.code = 3006;
        this.name = "AccountNotMutable";
        this.msg = "The given account is not mutable";
    }
}
exports.AccountNotMutable = AccountNotMutable;
AccountNotMutable.code = 3006;
class AccountOwnedByWrongProgram extends Error {
    constructor(logs) {
        super("3007: The given account is owned by a different program than expected");
        this.logs = logs;
        this.code = 3007;
        this.name = "AccountOwnedByWrongProgram";
        this.msg = "The given account is owned by a different program than expected";
    }
}
exports.AccountOwnedByWrongProgram = AccountOwnedByWrongProgram;
AccountOwnedByWrongProgram.code = 3007;
class InvalidProgramId extends Error {
    constructor(logs) {
        super("3008: Program ID was not as expected");
        this.logs = logs;
        this.code = 3008;
        this.name = "InvalidProgramId";
        this.msg = "Program ID was not as expected";
    }
}
exports.InvalidProgramId = InvalidProgramId;
InvalidProgramId.code = 3008;
class InvalidProgramExecutable extends Error {
    constructor(logs) {
        super("3009: Program account is not executable");
        this.logs = logs;
        this.code = 3009;
        this.name = "InvalidProgramExecutable";
        this.msg = "Program account is not executable";
    }
}
exports.InvalidProgramExecutable = InvalidProgramExecutable;
InvalidProgramExecutable.code = 3009;
class AccountNotSigner extends Error {
    constructor(logs) {
        super("3010: The given account did not sign");
        this.logs = logs;
        this.code = 3010;
        this.name = "AccountNotSigner";
        this.msg = "The given account did not sign";
    }
}
exports.AccountNotSigner = AccountNotSigner;
AccountNotSigner.code = 3010;
class AccountNotSystemOwned extends Error {
    constructor(logs) {
        super("3011: The given account is not owned by the system program");
        this.logs = logs;
        this.code = 3011;
        this.name = "AccountNotSystemOwned";
        this.msg = "The given account is not owned by the system program";
    }
}
exports.AccountNotSystemOwned = AccountNotSystemOwned;
AccountNotSystemOwned.code = 3011;
class AccountNotInitialized extends Error {
    constructor(logs) {
        super("3012: The program expected this account to be already initialized");
        this.logs = logs;
        this.code = 3012;
        this.name = "AccountNotInitialized";
        this.msg = "The program expected this account to be already initialized";
    }
}
exports.AccountNotInitialized = AccountNotInitialized;
AccountNotInitialized.code = 3012;
class AccountNotProgramData extends Error {
    constructor(logs) {
        super("3013: The given account is not a program data account");
        this.logs = logs;
        this.code = 3013;
        this.name = "AccountNotProgramData";
        this.msg = "The given account is not a program data account";
    }
}
exports.AccountNotProgramData = AccountNotProgramData;
AccountNotProgramData.code = 3013;
class AccountNotAssociatedTokenAccount extends Error {
    constructor(logs) {
        super("3014: The given account is not the associated token account");
        this.logs = logs;
        this.code = 3014;
        this.name = "AccountNotAssociatedTokenAccount";
        this.msg = "The given account is not the associated token account";
    }
}
exports.AccountNotAssociatedTokenAccount = AccountNotAssociatedTokenAccount;
AccountNotAssociatedTokenAccount.code = 3014;
class AccountSysvarMismatch extends Error {
    constructor(logs) {
        super("3015: The given public key does not match the required sysvar");
        this.logs = logs;
        this.code = 3015;
        this.name = "AccountSysvarMismatch";
        this.msg = "The given public key does not match the required sysvar";
    }
}
exports.AccountSysvarMismatch = AccountSysvarMismatch;
AccountSysvarMismatch.code = 3015;
class AccountReallocExceedsLimit extends Error {
    constructor(logs) {
        super("3016: The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit");
        this.logs = logs;
        this.code = 3016;
        this.name = "AccountReallocExceedsLimit";
        this.msg = "The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit";
    }
}
exports.AccountReallocExceedsLimit = AccountReallocExceedsLimit;
AccountReallocExceedsLimit.code = 3016;
class AccountDuplicateReallocs extends Error {
    constructor(logs) {
        super("3017: The account was duplicated for more than one reallocation");
        this.logs = logs;
        this.code = 3017;
        this.name = "AccountDuplicateReallocs";
        this.msg = "The account was duplicated for more than one reallocation";
    }
}
exports.AccountDuplicateReallocs = AccountDuplicateReallocs;
AccountDuplicateReallocs.code = 3017;
class DeclaredProgramIdMismatch extends Error {
    constructor(logs) {
        super("4100: The declared program id does not match the actual program id");
        this.logs = logs;
        this.code = 4100;
        this.name = "DeclaredProgramIdMismatch";
        this.msg = "The declared program id does not match the actual program id";
    }
}
exports.DeclaredProgramIdMismatch = DeclaredProgramIdMismatch;
DeclaredProgramIdMismatch.code = 4100;
class Deprecated extends Error {
    constructor(logs) {
        super("5000: The API being used is deprecated and should no longer be used");
        this.logs = logs;
        this.code = 5000;
        this.name = "Deprecated";
        this.msg = "The API being used is deprecated and should no longer be used";
    }
}
exports.Deprecated = Deprecated;
Deprecated.code = 5000;
function fromCode(code, logs) {
    switch (code) {
        case 100:
            return new InstructionMissing(logs);
        case 101:
            return new InstructionFallbackNotFound(logs);
        case 102:
            return new InstructionDidNotDeserialize(logs);
        case 103:
            return new InstructionDidNotSerialize(logs);
        case 1000:
            return new IdlInstructionStub(logs);
        case 1001:
            return new IdlInstructionInvalidProgram(logs);
        case 2000:
            return new ConstraintMut(logs);
        case 2001:
            return new ConstraintHasOne(logs);
        case 2002:
            return new ConstraintSigner(logs);
        case 2003:
            return new ConstraintRaw(logs);
        case 2004:
            return new ConstraintOwner(logs);
        case 2005:
            return new ConstraintRentExempt(logs);
        case 2006:
            return new ConstraintSeeds(logs);
        case 2007:
            return new ConstraintExecutable(logs);
        case 2008:
            return new ConstraintState(logs);
        case 2009:
            return new ConstraintAssociated(logs);
        case 2010:
            return new ConstraintAssociatedInit(logs);
        case 2011:
            return new ConstraintClose(logs);
        case 2012:
            return new ConstraintAddress(logs);
        case 2013:
            return new ConstraintZero(logs);
        case 2014:
            return new ConstraintTokenMint(logs);
        case 2015:
            return new ConstraintTokenOwner(logs);
        case 2016:
            return new ConstraintMintMintAuthority(logs);
        case 2017:
            return new ConstraintMintFreezeAuthority(logs);
        case 2018:
            return new ConstraintMintDecimals(logs);
        case 2019:
            return new ConstraintSpace(logs);
        case 2020:
            return new ConstraintAccountIsNone(logs);
        case 2500:
            return new RequireViolated(logs);
        case 2501:
            return new RequireEqViolated(logs);
        case 2502:
            return new RequireKeysEqViolated(logs);
        case 2503:
            return new RequireNeqViolated(logs);
        case 2504:
            return new RequireKeysNeqViolated(logs);
        case 2505:
            return new RequireGtViolated(logs);
        case 2506:
            return new RequireGteViolated(logs);
        case 3000:
            return new AccountDiscriminatorAlreadySet(logs);
        case 3001:
            return new AccountDiscriminatorNotFound(logs);
        case 3002:
            return new AccountDiscriminatorMismatch(logs);
        case 3003:
            return new AccountDidNotDeserialize(logs);
        case 3004:
            return new AccountDidNotSerialize(logs);
        case 3005:
            return new AccountNotEnoughKeys(logs);
        case 3006:
            return new AccountNotMutable(logs);
        case 3007:
            return new AccountOwnedByWrongProgram(logs);
        case 3008:
            return new InvalidProgramId(logs);
        case 3009:
            return new InvalidProgramExecutable(logs);
        case 3010:
            return new AccountNotSigner(logs);
        case 3011:
            return new AccountNotSystemOwned(logs);
        case 3012:
            return new AccountNotInitialized(logs);
        case 3013:
            return new AccountNotProgramData(logs);
        case 3014:
            return new AccountNotAssociatedTokenAccount(logs);
        case 3015:
            return new AccountSysvarMismatch(logs);
        case 3016:
            return new AccountReallocExceedsLimit(logs);
        case 3017:
            return new AccountDuplicateReallocs(logs);
        case 4100:
            return new DeclaredProgramIdMismatch(logs);
        case 5000:
            return new Deprecated(logs);
    }
    return null;
}
exports.fromCode = fromCode;
//# sourceMappingURL=anchor.js.map
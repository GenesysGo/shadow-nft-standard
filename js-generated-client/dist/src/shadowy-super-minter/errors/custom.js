"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minterFromCode = exports.CollectionNotForMinter = exports.MintNotOpen = exports.InvalidAccount = exports.InvalidTimes = exports.InvalidString = exports.CannotFindUsableAsset = exports.InvalidMintAuthority = exports.MetadataAccountMustBeEmpty = exports.ShadowySuperMinterEmpty = exports.TooManyCreators = exports.NumericalOverflowError = exports.IndexGreaterThanLength = exports.Uninitialized = void 0;
class Uninitialized extends Error {
    constructor(logs) {
        super("6000: Account is not initialized");
        this.logs = logs;
        this.code = 6000;
        this.name = "Uninitialized";
        this.msg = "Account is not initialized";
    }
}
exports.Uninitialized = Uninitialized;
Uninitialized.code = 6000;
class IndexGreaterThanLength extends Error {
    constructor(logs) {
        super("6001: Index greater than length");
        this.logs = logs;
        this.code = 6001;
        this.name = "IndexGreaterThanLength";
        this.msg = "Index greater than length";
    }
}
exports.IndexGreaterThanLength = IndexGreaterThanLength;
IndexGreaterThanLength.code = 6001;
class NumericalOverflowError extends Error {
    constructor(logs) {
        super("6002: Numerical overflow error");
        this.logs = logs;
        this.code = 6002;
        this.name = "NumericalOverflowError";
        this.msg = "Numerical overflow error";
    }
}
exports.NumericalOverflowError = NumericalOverflowError;
NumericalOverflowError.code = 6002;
class TooManyCreators extends Error {
    constructor(logs) {
        super("6003: Can only provide up to 4 creators to ssm (because ssm is one)");
        this.logs = logs;
        this.code = 6003;
        this.name = "TooManyCreators";
        this.msg = "Can only provide up to 4 creators to ssm (because ssm is one)";
    }
}
exports.TooManyCreators = TooManyCreators;
TooManyCreators.code = 6003;
class ShadowySuperMinterEmpty extends Error {
    constructor(logs) {
        super("6004: SSM is empty");
        this.logs = logs;
        this.code = 6004;
        this.name = "ShadowySuperMinterEmpty";
        this.msg = "SSM is empty";
    }
}
exports.ShadowySuperMinterEmpty = ShadowySuperMinterEmpty;
ShadowySuperMinterEmpty.code = 6004;
class MetadataAccountMustBeEmpty extends Error {
    constructor(logs) {
        super("6005: The metadata account has data in it, and this must be empty to mint a new NFT");
        this.logs = logs;
        this.code = 6005;
        this.name = "MetadataAccountMustBeEmpty";
        this.msg = "The metadata account has data in it, and this must be empty to mint a new NFT";
    }
}
exports.MetadataAccountMustBeEmpty = MetadataAccountMustBeEmpty;
MetadataAccountMustBeEmpty.code = 6005;
class InvalidMintAuthority extends Error {
    constructor(logs) {
        super("6006: Mint authority provided does not match the authority on the mint");
        this.logs = logs;
        this.code = 6006;
        this.name = "InvalidMintAuthority";
        this.msg = "Mint authority provided does not match the authority on the mint";
    }
}
exports.InvalidMintAuthority = InvalidMintAuthority;
InvalidMintAuthority.code = 6006;
class CannotFindUsableAsset extends Error {
    constructor(logs) {
        super("6007: Unable to find an unused asset near your random number index");
        this.logs = logs;
        this.code = 6007;
        this.name = "CannotFindUsableAsset";
        this.msg = "Unable to find an unused asset near your random number index";
    }
}
exports.CannotFindUsableAsset = CannotFindUsableAsset;
CannotFindUsableAsset.code = 6007;
class InvalidString extends Error {
    constructor(logs) {
        super("6008: Invalid string");
        this.logs = logs;
        this.code = 6008;
        this.name = "InvalidString";
        this.msg = "Invalid string";
    }
}
exports.InvalidString = InvalidString;
InvalidString.code = 6008;
class InvalidTimes extends Error {
    constructor(logs) {
        super("6009: Either the end time you specified for the minter is in the past, \
        or the start time you specified for the minter comes after the end time");
        this.logs = logs;
        this.code = 6009;
        this.name = "InvalidTimes";
        this.msg = "Either the end time you specified for the minter is in the past, \
        or the start time you specified for the minter comes after the end time";
    }
}
exports.InvalidTimes = InvalidTimes;
InvalidTimes.code = 6009;
class InvalidAccount extends Error {
    constructor(logs) {
        super("6010: The instruction contains an invalid account");
        this.logs = logs;
        this.code = 6010;
        this.name = "InvalidAccount";
        this.msg = "The instruction contains an invalid account";
    }
}
exports.InvalidAccount = InvalidAccount;
InvalidAccount.code = 6010;
class MintNotOpen extends Error {
    constructor(logs) {
        super("6011: This mint has either not yet begun or has already ended");
        this.logs = logs;
        this.code = 6011;
        this.name = "MintNotOpen";
        this.msg = "This mint has either not yet begun or has already ended";
    }
}
exports.MintNotOpen = MintNotOpen;
MintNotOpen.code = 6011;
class CollectionNotForMinter extends Error {
    constructor(logs) {
        super("6012: This already-initialized collection is not to be used with a minter");
        this.logs = logs;
        this.code = 6012;
        this.name = "CollectionNotForMinter";
        this.msg = "This already-initialized collection is not to be used with a minter";
    }
}
exports.CollectionNotForMinter = CollectionNotForMinter;
CollectionNotForMinter.code = 6012;
function minterFromCode(code, logs) {
    switch (code) {
        case 6000:
            return new Uninitialized(logs);
        case 6001:
            return new IndexGreaterThanLength(logs);
        case 6002:
            return new NumericalOverflowError(logs);
        case 6003:
            return new TooManyCreators(logs);
        case 6004:
            return new ShadowySuperMinterEmpty(logs);
        case 6005:
            return new MetadataAccountMustBeEmpty(logs);
        case 6006:
            return new InvalidMintAuthority(logs);
        case 6007:
            return new CannotFindUsableAsset(logs);
        case 6008:
            return new InvalidString(logs);
        case 6009:
            return new InvalidTimes(logs);
        case 6010:
            return new InvalidAccount(logs);
        case 6011:
            return new MintNotOpen(logs);
        case 6012:
            return new CollectionNotForMinter(logs);
    }
    return null;
}
exports.minterFromCode = minterFromCode;
//# sourceMappingURL=custom.js.map
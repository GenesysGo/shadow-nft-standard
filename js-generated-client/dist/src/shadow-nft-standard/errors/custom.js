"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromCode = exports.InvalidRoyalties = exports.UnintializedCollection = exports.UnintializedGroup = exports.IntegerOverflow = exports.IncorrectCreatorGroupSize = exports.SymbolToolarge = exports.DuplicateCreator = exports.CreatorNotSignerForMultisig = exports.CreatorNotPresentForMultisig = exports.CreatorMustBeSystemAccount = exports.ExceedsMaxGroupSize = exports.InvalidArguments = exports.ImmutableAccount = exports.Unauthorized = exports.InsufficientSolForMint = exports.PrimarySale = exports.DivisibleToken = exports.InvalidMintAuthority = exports.FreezeAuthorityPresent = void 0;
class FreezeAuthorityPresent extends Error {
    constructor(logs) {
        super("6000: Mint account has a freeze authority");
        this.logs = logs;
        this.code = 6000;
        this.name = "FreezeAuthorityPresent";
        this.msg = "Mint account has a freeze authority";
    }
}
exports.FreezeAuthorityPresent = FreezeAuthorityPresent;
FreezeAuthorityPresent.code = 6000;
class InvalidMintAuthority extends Error {
    constructor(logs) {
        super("6001: Metadata account must have mint authority");
        this.logs = logs;
        this.code = 6001;
        this.name = "InvalidMintAuthority";
        this.msg = "Metadata account must have mint authority";
    }
}
exports.InvalidMintAuthority = InvalidMintAuthority;
InvalidMintAuthority.code = 6001;
class DivisibleToken extends Error {
    constructor(logs) {
        super("6002: Mint account either has a nonunitary supply or nonzero decimals");
        this.logs = logs;
        this.code = 6002;
        this.name = "DivisibleToken";
        this.msg = "Mint account either has a nonunitary supply or nonzero decimals";
    }
}
exports.DivisibleToken = DivisibleToken;
DivisibleToken.code = 6002;
class PrimarySale extends Error {
    constructor(logs) {
        super("6003: Primary sale already occured");
        this.logs = logs;
        this.code = 6003;
        this.name = "PrimarySale";
        this.msg = "Primary sale already occured";
    }
}
exports.PrimarySale = PrimarySale;
PrimarySale.code = 6003;
class InsufficientSolForMint extends Error {
    constructor(logs) {
        super("6004: Insufficient SOL for mint");
        this.logs = logs;
        this.code = 6004;
        this.name = "InsufficientSolForMint";
        this.msg = "Insufficient SOL for mint";
    }
}
exports.InsufficientSolForMint = InsufficientSolForMint;
InsufficientSolForMint.code = 6004;
class Unauthorized extends Error {
    constructor(logs) {
        super("6005: Unauthorized");
        this.logs = logs;
        this.code = 6005;
        this.name = "Unauthorized";
        this.msg = "Unauthorized";
    }
}
exports.Unauthorized = Unauthorized;
Unauthorized.code = 6005;
class ImmutableAccount extends Error {
    constructor(logs) {
        super("6006: This metadata accounts is immutable");
        this.logs = logs;
        this.code = 6006;
        this.name = "ImmutableAccount";
        this.msg = "This metadata accounts is immutable";
    }
}
exports.ImmutableAccount = ImmutableAccount;
ImmutableAccount.code = 6006;
class InvalidArguments extends Error {
    constructor(logs) {
        super("6007: The instruction received invalid input");
        this.logs = logs;
        this.code = 6007;
        this.name = "InvalidArguments";
        this.msg = "The instruction received invalid input";
    }
}
exports.InvalidArguments = InvalidArguments;
InvalidArguments.code = 6007;
class ExceedsMaxGroupSize extends Error {
    constructor(logs) {
        super("6008: Attempted to create a group which exceeds the maximum number of members");
        this.logs = logs;
        this.code = 6008;
        this.name = "ExceedsMaxGroupSize";
        this.msg = "Attempted to create a group which exceeds the maximum number of members";
    }
}
exports.ExceedsMaxGroupSize = ExceedsMaxGroupSize;
ExceedsMaxGroupSize.code = 6008;
class CreatorMustBeSystemAccount extends Error {
    constructor(logs) {
        super("6009: A creator must be a system account");
        this.logs = logs;
        this.code = 6009;
        this.name = "CreatorMustBeSystemAccount";
        this.msg = "A creator must be a system account";
    }
}
exports.CreatorMustBeSystemAccount = CreatorMustBeSystemAccount;
CreatorMustBeSystemAccount.code = 6009;
class CreatorNotPresentForMultisig extends Error {
    constructor(logs) {
        super("6010: A creator was not present for a multisig operation");
        this.logs = logs;
        this.code = 6010;
        this.name = "CreatorNotPresentForMultisig";
        this.msg = "A creator was not present for a multisig operation";
    }
}
exports.CreatorNotPresentForMultisig = CreatorNotPresentForMultisig;
CreatorNotPresentForMultisig.code = 6010;
class CreatorNotSignerForMultisig extends Error {
    constructor(logs) {
        super("6011: A creator did not sign for a multisig operation");
        this.logs = logs;
        this.code = 6011;
        this.name = "CreatorNotSignerForMultisig";
        this.msg = "A creator did not sign for a multisig operation";
    }
}
exports.CreatorNotSignerForMultisig = CreatorNotSignerForMultisig;
CreatorNotSignerForMultisig.code = 6011;
class DuplicateCreator extends Error {
    constructor(logs) {
        super("6012: A creator was included twice in a group");
        this.logs = logs;
        this.code = 6012;
        this.name = "DuplicateCreator";
        this.msg = "A creator was included twice in a group";
    }
}
exports.DuplicateCreator = DuplicateCreator;
DuplicateCreator.code = 6012;
class SymbolToolarge extends Error {
    constructor(logs) {
        super("6013: The symbol provided is too large");
        this.logs = logs;
        this.code = 6013;
        this.name = "SymbolToolarge";
        this.msg = "The symbol provided is too large";
    }
}
exports.SymbolToolarge = SymbolToolarge;
SymbolToolarge.code = 6013;
class IncorrectCreatorGroupSize extends Error {
    constructor(logs) {
        super("6014: Incorrect creator group size");
        this.logs = logs;
        this.code = 6014;
        this.name = "IncorrectCreatorGroupSize";
        this.msg = "Incorrect creator group size";
    }
}
exports.IncorrectCreatorGroupSize = IncorrectCreatorGroupSize;
IncorrectCreatorGroupSize.code = 6014;
class IntegerOverflow extends Error {
    constructor(logs) {
        super("6015: An integer overflowed");
        this.logs = logs;
        this.code = 6015;
        this.name = "IntegerOverflow";
        this.msg = "An integer overflowed";
    }
}
exports.IntegerOverflow = IntegerOverflow;
IntegerOverflow.code = 6015;
class UnintializedGroup extends Error {
    constructor(logs) {
        super("6016: Not all creators have signed to create this group");
        this.logs = logs;
        this.code = 6016;
        this.name = "UnintializedGroup";
        this.msg = "Not all creators have signed to create this group";
    }
}
exports.UnintializedGroup = UnintializedGroup;
UnintializedGroup.code = 6016;
class UnintializedCollection extends Error {
    constructor(logs) {
        super("6017: Not all creators have signed to create this collection");
        this.logs = logs;
        this.code = 6017;
        this.name = "UnintializedCollection";
        this.msg = "Not all creators have signed to create this collection";
    }
}
exports.UnintializedCollection = UnintializedCollection;
UnintializedCollection.code = 6017;
class InvalidRoyalties extends Error {
    constructor(logs) {
        super("6018: The royalties you provided add up to >100%");
        this.logs = logs;
        this.code = 6018;
        this.name = "InvalidRoyalties";
        this.msg = "The royalties you provided add up to >100%";
    }
}
exports.InvalidRoyalties = InvalidRoyalties;
InvalidRoyalties.code = 6018;
function fromCode(code, logs) {
    switch (code) {
        case 6000:
            return new FreezeAuthorityPresent(logs);
        case 6001:
            return new InvalidMintAuthority(logs);
        case 6002:
            return new DivisibleToken(logs);
        case 6003:
            return new PrimarySale(logs);
        case 6004:
            return new InsufficientSolForMint(logs);
        case 6005:
            return new Unauthorized(logs);
        case 6006:
            return new ImmutableAccount(logs);
        case 6007:
            return new InvalidArguments(logs);
        case 6008:
            return new ExceedsMaxGroupSize(logs);
        case 6009:
            return new CreatorMustBeSystemAccount(logs);
        case 6010:
            return new CreatorNotPresentForMultisig(logs);
        case 6011:
            return new CreatorNotSignerForMultisig(logs);
        case 6012:
            return new DuplicateCreator(logs);
        case 6013:
            return new SymbolToolarge(logs);
        case 6014:
            return new IncorrectCreatorGroupSize(logs);
        case 6015:
            return new IntegerOverflow(logs);
        case 6016:
            return new UnintializedGroup(logs);
        case 6017:
            return new UnintializedCollection(logs);
        case 6018:
            return new InvalidRoyalties(logs);
    }
    return null;
}
exports.fromCode = fromCode;
//# sourceMappingURL=custom.js.map
export type CustomError =
  | FreezeAuthorityPresent
  | InvalidMintAuthority
  | DivisibleToken
  | PrimarySale
  | InsufficientSolForMint
  | Unauthorized
  | ImmutableAccount
  | InvalidArguments
  | ExceedsMaxGroupSize
  | CreatorMustBeSystemAccount
  | CreatorNotPresentForMultisig
  | CreatorNotSignerForMultisig
  | DuplicateCreator
  | SymbolToolarge
  | IncorrectCreatorGroupSize
  | IntegerOverflow
  | UnintializedGroup
  | UnintializedCollection
  | InvalidRoyalties

export class FreezeAuthorityPresent extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "FreezeAuthorityPresent"
  readonly msg = "Mint account has a freeze authority"

  constructor(readonly logs?: string[]) {
    super("6000: Mint account has a freeze authority")
  }
}

export class InvalidMintAuthority extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidMintAuthority"
  readonly msg = "Metadata account must have mint authority"

  constructor(readonly logs?: string[]) {
    super("6001: Metadata account must have mint authority")
  }
}

export class DivisibleToken extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "DivisibleToken"
  readonly msg =
    "Mint account either has a nonunitary supply or nonzero decimals"

  constructor(readonly logs?: string[]) {
    super(
      "6002: Mint account either has a nonunitary supply or nonzero decimals"
    )
  }
}

export class PrimarySale extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "PrimarySale"
  readonly msg = "Primary sale already occured"

  constructor(readonly logs?: string[]) {
    super("6003: Primary sale already occured")
  }
}

export class InsufficientSolForMint extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InsufficientSolForMint"
  readonly msg = "Insufficient SOL for mint"

  constructor(readonly logs?: string[]) {
    super("6004: Insufficient SOL for mint")
  }
}

export class Unauthorized extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "Unauthorized"
  readonly msg = "Unauthorized"

  constructor(readonly logs?: string[]) {
    super("6005: Unauthorized")
  }
}

export class ImmutableAccount extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "ImmutableAccount"
  readonly msg = "This metadata accounts is immutable"

  constructor(readonly logs?: string[]) {
    super("6006: This metadata accounts is immutable")
  }
}

export class InvalidArguments extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "InvalidArguments"
  readonly msg = "The instruction received invalid input"

  constructor(readonly logs?: string[]) {
    super("6007: The instruction received invalid input")
  }
}

export class ExceedsMaxGroupSize extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "ExceedsMaxGroupSize"
  readonly msg =
    "Attempted to create a group which exceeds the maximum number of members"

  constructor(readonly logs?: string[]) {
    super(
      "6008: Attempted to create a group which exceeds the maximum number of members"
    )
  }
}

export class CreatorMustBeSystemAccount extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "CreatorMustBeSystemAccount"
  readonly msg = "A creator must be a system account"

  constructor(readonly logs?: string[]) {
    super("6009: A creator must be a system account")
  }
}

export class CreatorNotPresentForMultisig extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "CreatorNotPresentForMultisig"
  readonly msg = "A creator was not present for a multisig operation"

  constructor(readonly logs?: string[]) {
    super("6010: A creator was not present for a multisig operation")
  }
}

export class CreatorNotSignerForMultisig extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "CreatorNotSignerForMultisig"
  readonly msg = "A creator did not sign for a multisig operation"

  constructor(readonly logs?: string[]) {
    super("6011: A creator did not sign for a multisig operation")
  }
}

export class DuplicateCreator extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "DuplicateCreator"
  readonly msg = "A creator was included twice in a group"

  constructor(readonly logs?: string[]) {
    super("6012: A creator was included twice in a group")
  }
}

export class SymbolToolarge extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "SymbolToolarge"
  readonly msg = "The symbol provided is too large"

  constructor(readonly logs?: string[]) {
    super("6013: The symbol provided is too large")
  }
}

export class IncorrectCreatorGroupSize extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "IncorrectCreatorGroupSize"
  readonly msg = "Incorrect creator group size"

  constructor(readonly logs?: string[]) {
    super("6014: Incorrect creator group size")
  }
}

export class IntegerOverflow extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "IntegerOverflow"
  readonly msg = "An integer overflowed"

  constructor(readonly logs?: string[]) {
    super("6015: An integer overflowed")
  }
}

export class UnintializedGroup extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "UnintializedGroup"
  readonly msg = "Not all creators have signed to create this group"

  constructor(readonly logs?: string[]) {
    super("6016: Not all creators have signed to create this group")
  }
}

export class UnintializedCollection extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "UnintializedCollection"
  readonly msg = "Not all creators have signed to create this collection"

  constructor(readonly logs?: string[]) {
    super("6017: Not all creators have signed to create this collection")
  }
}

export class InvalidRoyalties extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "InvalidRoyalties"
  readonly msg = "The royalties you provided add up to >100%"

  constructor(readonly logs?: string[]) {
    super("6018: The royalties you provided add up to >100%")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new FreezeAuthorityPresent(logs)
    case 6001:
      return new InvalidMintAuthority(logs)
    case 6002:
      return new DivisibleToken(logs)
    case 6003:
      return new PrimarySale(logs)
    case 6004:
      return new InsufficientSolForMint(logs)
    case 6005:
      return new Unauthorized(logs)
    case 6006:
      return new ImmutableAccount(logs)
    case 6007:
      return new InvalidArguments(logs)
    case 6008:
      return new ExceedsMaxGroupSize(logs)
    case 6009:
      return new CreatorMustBeSystemAccount(logs)
    case 6010:
      return new CreatorNotPresentForMultisig(logs)
    case 6011:
      return new CreatorNotSignerForMultisig(logs)
    case 6012:
      return new DuplicateCreator(logs)
    case 6013:
      return new SymbolToolarge(logs)
    case 6014:
      return new IncorrectCreatorGroupSize(logs)
    case 6015:
      return new IntegerOverflow(logs)
    case 6016:
      return new UnintializedGroup(logs)
    case 6017:
      return new UnintializedCollection(logs)
    case 6018:
      return new InvalidRoyalties(logs)
  }

  return null
}

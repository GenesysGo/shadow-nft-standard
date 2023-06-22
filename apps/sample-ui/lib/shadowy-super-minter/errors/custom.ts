export type CustomError =
  | Uninitialized
  | IndexGreaterThanLength
  | NumericalOverflowError
  | TooManyCreators
  | ShadowySuperMinterEmpty
  | MetadataAccountMustBeEmpty
  | InvalidMintAuthority
  | CannotFindUsableAsset
  | InvalidString
  | InvalidTimes
  | InvalidAccount
  | MintNotOpen
  | CollectionNotForMinter

export class Uninitialized extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "Uninitialized"
  readonly msg = "Account is not initialized"

  constructor(readonly logs?: string[]) {
    super("6000: Account is not initialized")
  }
}

export class IndexGreaterThanLength extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "IndexGreaterThanLength"
  readonly msg = "Index greater than length"

  constructor(readonly logs?: string[]) {
    super("6001: Index greater than length")
  }
}

export class NumericalOverflowError extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "NumericalOverflowError"
  readonly msg = "Numerical overflow error"

  constructor(readonly logs?: string[]) {
    super("6002: Numerical overflow error")
  }
}

export class TooManyCreators extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "TooManyCreators"
  readonly msg = "Can only provide up to 4 creators to ssm (because ssm is one)"

  constructor(readonly logs?: string[]) {
    super("6003: Can only provide up to 4 creators to ssm (because ssm is one)")
  }
}

export class ShadowySuperMinterEmpty extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "ShadowySuperMinterEmpty"
  readonly msg = "SSM is empty"

  constructor(readonly logs?: string[]) {
    super("6004: SSM is empty")
  }
}

export class MetadataAccountMustBeEmpty extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "MetadataAccountMustBeEmpty"
  readonly msg =
    "The metadata account has data in it, and this must be empty to mint a new NFT"

  constructor(readonly logs?: string[]) {
    super(
      "6005: The metadata account has data in it, and this must be empty to mint a new NFT"
    )
  }
}

export class InvalidMintAuthority extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "InvalidMintAuthority"
  readonly msg =
    "Mint authority provided does not match the authority on the mint"

  constructor(readonly logs?: string[]) {
    super(
      "6006: Mint authority provided does not match the authority on the mint"
    )
  }
}

export class CannotFindUsableAsset extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "CannotFindUsableAsset"
  readonly msg = "Unable to find an unused asset near your random number index"

  constructor(readonly logs?: string[]) {
    super("6007: Unable to find an unused asset near your random number index")
  }
}

export class InvalidString extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "InvalidString"
  readonly msg = "Invalid string"

  constructor(readonly logs?: string[]) {
    super("6008: Invalid string")
  }
}

export class InvalidTimes extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "InvalidTimes"
  readonly msg =
    "Either the end time you specified for the minter is in the past, \
        or the start time you specified for the minter comes after the end time"

  constructor(readonly logs?: string[]) {
    super(
      "6009: Either the end time you specified for the minter is in the past, \
        or the start time you specified for the minter comes after the end time"
    )
  }
}

export class InvalidAccount extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "InvalidAccount"
  readonly msg = "The instruction contains an invalid account"

  constructor(readonly logs?: string[]) {
    super("6010: The instruction contains an invalid account")
  }
}

export class MintNotOpen extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "MintNotOpen"
  readonly msg = "This mint has either not yet begun or has already ended"

  constructor(readonly logs?: string[]) {
    super("6011: This mint has either not yet begun or has already ended")
  }
}

export class CollectionNotForMinter extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "CollectionNotForMinter"
  readonly msg =
    "This already-initialized collection is not to be used with a minter"

  constructor(readonly logs?: string[]) {
    super(
      "6012: This already-initialized collection is not to be used with a minter"
    )
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new Uninitialized(logs)
    case 6001:
      return new IndexGreaterThanLength(logs)
    case 6002:
      return new NumericalOverflowError(logs)
    case 6003:
      return new TooManyCreators(logs)
    case 6004:
      return new ShadowySuperMinterEmpty(logs)
    case 6005:
      return new MetadataAccountMustBeEmpty(logs)
    case 6006:
      return new InvalidMintAuthority(logs)
    case 6007:
      return new CannotFindUsableAsset(logs)
    case 6008:
      return new InvalidString(logs)
    case 6009:
      return new InvalidTimes(logs)
    case 6010:
      return new InvalidAccount(logs)
    case 6011:
      return new MintNotOpen(logs)
    case 6012:
      return new CollectionNotForMinter(logs)
  }

  return null
}

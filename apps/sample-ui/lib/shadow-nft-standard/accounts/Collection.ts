// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface CollectionFields {
  /** Pubkey of the creator group that created this collection */
  creatorGroupKey: PublicKey
  /** Number of items in the collection */
  size: number
  /** Signatures indicating whether the collection has been signed by all creators */
  sigs: number
  /** Whether this collection will be minted via minter */
  forMinter: boolean
  /**
   * Royalty per creator (in half-percentages!). Half-percentages are used
   * to be able to use a single byte (0 to 255) effectively.
   *
   * # Examples
   * `royalty_50bps_multiplier` = 4
   * -> 4 * 0.5% = 2% royalty
   *
   * `royalty_50bps_multiplier` = 7
   * -> 7 * 0.5% = 3.5% royalty
   *
   * The number of nonzero entries must match the number of creators in the creator group.
   * This should be enforced upon the initialization of a collection.
   */
  royalty50bps: Array<number>
  /** Symbol for the collection */
  symbol: types.SymbolFields
  /** Name for the collection */
  name: string
}

export interface CollectionJSON {
  /** Pubkey of the creator group that created this collection */
  creatorGroupKey: string
  /** Number of items in the collection */
  size: number
  /** Signatures indicating whether the collection has been signed by all creators */
  sigs: number
  /** Whether this collection will be minted via minter */
  forMinter: boolean
  /**
   * Royalty per creator (in half-percentages!). Half-percentages are used
   * to be able to use a single byte (0 to 255) effectively.
   *
   * # Examples
   * `royalty_50bps_multiplier` = 4
   * -> 4 * 0.5% = 2% royalty
   *
   * `royalty_50bps_multiplier` = 7
   * -> 7 * 0.5% = 3.5% royalty
   *
   * The number of nonzero entries must match the number of creators in the creator group.
   * This should be enforced upon the initialization of a collection.
   */
  royalty50bps: Array<number>
  /** Symbol for the collection */
  symbol: types.SymbolJSON
  /** Name for the collection */
  name: string
}

export class Collection {
  /** Pubkey of the creator group that created this collection */
  readonly creatorGroupKey: PublicKey
  /** Number of items in the collection */
  readonly size: number
  /** Signatures indicating whether the collection has been signed by all creators */
  readonly sigs: number
  /** Whether this collection will be minted via minter */
  readonly forMinter: boolean
  /**
   * Royalty per creator (in half-percentages!). Half-percentages are used
   * to be able to use a single byte (0 to 255) effectively.
   *
   * # Examples
   * `royalty_50bps_multiplier` = 4
   * -> 4 * 0.5% = 2% royalty
   *
   * `royalty_50bps_multiplier` = 7
   * -> 7 * 0.5% = 3.5% royalty
   *
   * The number of nonzero entries must match the number of creators in the creator group.
   * This should be enforced upon the initialization of a collection.
   */
  readonly royalty50bps: Array<number>
  /** Symbol for the collection */
  readonly symbol: types.Symbol
  /** Name for the collection */
  readonly name: string

  static readonly discriminator = Buffer.from([
    48, 160, 232, 205, 191, 207, 26, 141,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("creatorGroupKey"),
    borsh.u32("size"),
    borsh.u8("sigs"),
    borsh.bool("forMinter"),
    borsh.array(borsh.u8(), 8, "royalty50bps"),
    types.Symbol.layout("symbol"),
    borsh.str("name"),
  ])

  constructor(fields: CollectionFields) {
    this.creatorGroupKey = fields.creatorGroupKey
    this.size = fields.size
    this.sigs = fields.sigs
    this.forMinter = fields.forMinter
    this.royalty50bps = fields.royalty50bps
    this.symbol = new types.Symbol({ ...fields.symbol })
    this.name = fields.name
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Collection | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<Collection | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Collection {
    if (!data.slice(0, 8).equals(Collection.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Collection.layout.decode(data.slice(8))

    return new Collection({
      creatorGroupKey: dec.creatorGroupKey,
      size: dec.size,
      sigs: dec.sigs,
      forMinter: dec.forMinter,
      royalty50bps: dec.royalty50bps,
      symbol: types.Symbol.fromDecoded(dec.symbol),
      name: dec.name,
    })
  }

  toJSON(): CollectionJSON {
    return {
      creatorGroupKey: this.creatorGroupKey.toString(),
      size: this.size,
      sigs: this.sigs,
      forMinter: this.forMinter,
      royalty50bps: this.royalty50bps,
      symbol: this.symbol.toJSON(),
      name: this.name,
    }
  }

  static fromJSON(obj: CollectionJSON): Collection {
    return new Collection({
      creatorGroupKey: new PublicKey(obj.creatorGroupKey),
      size: obj.size,
      sigs: obj.sigs,
      forMinter: obj.forMinter,
      royalty50bps: obj.royalty50bps,
      symbol: types.Symbol.fromJSON(obj.symbol),
      name: obj.name,
    })
  }
}

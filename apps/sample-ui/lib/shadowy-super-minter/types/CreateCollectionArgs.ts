// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface CreateCollectionArgsFields {
  /** The name of the collection */
  name: string
  /** The symbol for the collection */
  symbol: string
  /** Whether the collection will be used with a minter or 1/1s */
  forMinter: boolean
  /**
   * The royalties for the collection in half-percentages. This must be in
   * the same order as the creator keys are stored (they are sorted by `Pubkey`).
   *
   * Half-percentage are used to maximize the utility of a single `u8`.
   */
  royalty50bps: Uint8Array
}

export interface CreateCollectionArgsJSON {
  /** The name of the collection */
  name: string
  /** The symbol for the collection */
  symbol: string
  /** Whether the collection will be used with a minter or 1/1s */
  forMinter: boolean
  /**
   * The royalties for the collection in half-percentages. This must be in
   * the same order as the creator keys are stored (they are sorted by `Pubkey`).
   *
   * Half-percentage are used to maximize the utility of a single `u8`.
   */
  royalty50bps: Array<number>
}

export class CreateCollectionArgs {
  /** The name of the collection */
  readonly name: string
  /** The symbol for the collection */
  readonly symbol: string
  /** Whether the collection will be used with a minter or 1/1s */
  readonly forMinter: boolean
  /**
   * The royalties for the collection in half-percentages. This must be in
   * the same order as the creator keys are stored (they are sorted by `Pubkey`).
   *
   * Half-percentage are used to maximize the utility of a single `u8`.
   */
  readonly royalty50bps: Uint8Array

  constructor(fields: CreateCollectionArgsFields) {
    this.name = fields.name
    this.symbol = fields.symbol
    this.forMinter = fields.forMinter
    this.royalty50bps = fields.royalty50bps
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.str("name"),
        borsh.str("symbol"),
        borsh.bool("forMinter"),
        borsh.vecU8("royalty50bps"),
      ],
      property
    )
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new CreateCollectionArgs({
      name: obj.name,
      symbol: obj.symbol,
      forMinter: obj.forMinter,
      royalty50bps: new Uint8Array(
        obj.royalty50bps.buffer,
        obj.royalty50bps.byteOffset,
        obj.royalty50bps.length
      ),
    })
  }

  static toEncodable(fields: CreateCollectionArgsFields) {
    return {
      name: fields.name,
      symbol: fields.symbol,
      forMinter: fields.forMinter,
      royalty50bps: Buffer.from(
        fields.royalty50bps.buffer,
        fields.royalty50bps.byteOffset,
        fields.royalty50bps.length
      ),
    }
  }

  toJSON(): CreateCollectionArgsJSON {
    return {
      name: this.name,
      symbol: this.symbol,
      forMinter: this.forMinter,
      royalty50bps: Array.from(this.royalty50bps.values()),
    }
  }

  static fromJSON(obj: CreateCollectionArgsJSON): CreateCollectionArgs {
    return new CreateCollectionArgs({
      name: obj.name,
      symbol: obj.symbol,
      forMinter: obj.forMinter,
      royalty50bps: Uint8Array.from(obj.royalty50bps),
    })
  }

  toEncodable() {
    return CreateCollectionArgs.toEncodable(this)
  }
}

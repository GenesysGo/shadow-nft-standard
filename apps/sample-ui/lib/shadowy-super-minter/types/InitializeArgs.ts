// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface InitializeArgsFields {
  /** Number of items available for minting */
  itemsAvailable: number
  /** Mint price */
  price: BN
  /** The mint's start time (Solana Cluster Time) */
  startTime: BN
  /** The mint's end time (Solana Cluster Time) */
  endTime: BN
  mintType: types.UniformMintFields
  /** Optional field if initializing collection */
  ifInitCollection: types.CreateCollectionArgsFields | null
  /** Optional field if initializing group */
  ifInitGroupName: string
}

export interface InitializeArgsJSON {
  /** Number of items available for minting */
  itemsAvailable: number
  /** Mint price */
  price: string
  /** The mint's start time (Solana Cluster Time) */
  startTime: string
  /** The mint's end time (Solana Cluster Time) */
  endTime: string
  mintType: types.UniformMintJSON
  /** Optional field if initializing collection */
  ifInitCollection: types.CreateCollectionArgsJSON | null
  /** Optional field if initializing group */
  ifInitGroupName: string
}

export class InitializeArgs {
  /** Number of items available for minting */
  readonly itemsAvailable: number
  /** Mint price */
  readonly price: BN
  /** The mint's start time (Solana Cluster Time) */
  readonly startTime: BN
  /** The mint's end time (Solana Cluster Time) */
  readonly endTime: BN
  readonly mintType: types.UniformMint
  /** Optional field if initializing collection */
  readonly ifInitCollection: types.CreateCollectionArgs | null
  /** Optional field if initializing group */
  readonly ifInitGroupName: string

  constructor(fields: InitializeArgsFields) {
    this.itemsAvailable = fields.itemsAvailable
    this.price = fields.price
    this.startTime = fields.startTime
    this.endTime = fields.endTime
    this.mintType = new types.UniformMint({ ...fields.mintType })
    this.ifInitCollection =
      (fields.ifInitCollection &&
        new types.CreateCollectionArgs({ ...fields.ifInitCollection })) ||
      null
    this.ifInitGroupName = fields.ifInitGroupName
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32("itemsAvailable"),
        borsh.u64("price"),
        borsh.i64("startTime"),
        borsh.i64("endTime"),
        types.UniformMint.layout("mintType"),
        borsh.option(types.CreateCollectionArgs.layout(), "ifInitCollection"),
        borsh.str("ifInitGroupName"),
      ],
      property
    )
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new InitializeArgs({
      itemsAvailable: obj.itemsAvailable,
      price: obj.price,
      startTime: obj.startTime,
      endTime: obj.endTime,
      mintType: types.UniformMint.fromDecoded(obj.mintType),
      ifInitCollection:
        (obj.ifInitCollection &&
          types.CreateCollectionArgs.fromDecoded(obj.ifInitCollection)) ||
        null,
      ifInitGroupName: obj.ifInitGroupName,
    })
  }

  static toEncodable(fields: InitializeArgsFields) {
    return {
      itemsAvailable: fields.itemsAvailable,
      price: fields.price,
      startTime: fields.startTime,
      endTime: fields.endTime,
      mintType: types.UniformMint.toEncodable(fields.mintType),
      ifInitCollection:
        (fields.ifInitCollection &&
          types.CreateCollectionArgs.toEncodable(fields.ifInitCollection)) ||
        null,
      ifInitGroupName: fields.ifInitGroupName,
    }
  }

  toJSON(): InitializeArgsJSON {
    return {
      itemsAvailable: this.itemsAvailable,
      price: this.price.toString(),
      startTime: this.startTime.toString(),
      endTime: this.endTime.toString(),
      mintType: this.mintType.toJSON(),
      ifInitCollection:
        (this.ifInitCollection && this.ifInitCollection.toJSON()) || null,
      ifInitGroupName: this.ifInitGroupName,
    }
  }

  static fromJSON(obj: InitializeArgsJSON): InitializeArgs {
    return new InitializeArgs({
      itemsAvailable: obj.itemsAvailable,
      price: new BN(obj.price),
      startTime: new BN(obj.startTime),
      endTime: new BN(obj.endTime),
      mintType: types.UniformMint.fromJSON(obj.mintType),
      ifInitCollection:
        (obj.ifInitCollection &&
          types.CreateCollectionArgs.fromJSON(obj.ifInitCollection)) ||
        null,
      ifInitGroupName: obj.ifInitGroupName,
    })
  }

  toEncodable() {
    return InitializeArgs.toEncodable(this)
  }
}

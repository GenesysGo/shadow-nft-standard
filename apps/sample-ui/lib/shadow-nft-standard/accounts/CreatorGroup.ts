// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface CreatorGroupFields {
  /** Number of signatures collected */
  sigs: number
  /** Counter keeping track of the number of collections that have been made */
  numCollections: BN
  /** The creators that make up this group */
  creators: Array<PublicKey>
  /** The name of the group */
  name: string
}

export interface CreatorGroupJSON {
  /** Number of signatures collected */
  sigs: number
  /** Counter keeping track of the number of collections that have been made */
  numCollections: string
  /** The creators that make up this group */
  creators: Array<string>
  /** The name of the group */
  name: string
}

export class CreatorGroup {
  /** Number of signatures collected */
  readonly sigs: number
  /** Counter keeping track of the number of collections that have been made */
  readonly numCollections: BN
  /** The creators that make up this group */
  readonly creators: Array<PublicKey>
  /** The name of the group */
  readonly name: string

  static readonly discriminator = Buffer.from([
    65, 127, 63, 76, 244, 96, 171, 134,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("sigs"),
    borsh.u64("numCollections"),
    borsh.vec(borsh.publicKey(), "creators"),
    borsh.str("name"),
  ])

  constructor(fields: CreatorGroupFields) {
    this.sigs = fields.sigs
    this.numCollections = fields.numCollections
    this.creators = fields.creators
    this.name = fields.name
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<CreatorGroup | null> {
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
  ): Promise<Array<CreatorGroup | null>> {
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

  static decode(data: Buffer): CreatorGroup {
    if (!data.slice(0, 8).equals(CreatorGroup.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CreatorGroup.layout.decode(data.slice(8))

    return new CreatorGroup({
      sigs: dec.sigs,
      numCollections: dec.numCollections,
      creators: dec.creators,
      name: dec.name,
    })
  }

  toJSON(): CreatorGroupJSON {
    return {
      sigs: this.sigs,
      numCollections: this.numCollections.toString(),
      creators: this.creators.map((item) => item.toString()),
      name: this.name,
    }
  }

  static fromJSON(obj: CreatorGroupJSON): CreatorGroup {
    return new CreatorGroup({
      sigs: obj.sigs,
      numCollections: new BN(obj.numCollections),
      creators: obj.creators.map((item) => new PublicKey(item)),
      name: obj.name,
    })
  }
}

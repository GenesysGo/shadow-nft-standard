// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface CreateGroupArgsFields {
  name: string
}

export interface CreateGroupArgsJSON {
  name: string
}

export class CreateGroupArgs {
  readonly name: string

  constructor(fields: CreateGroupArgsFields) {
    this.name = fields.name
  }

  static layout(property?: string) {
    return borsh.struct([borsh.str("name")], property)
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new CreateGroupArgs({
      name: obj.name,
    })
  }

  static toEncodable(fields: CreateGroupArgsFields) {
    return {
      name: fields.name,
    }
  }

  toJSON(): CreateGroupArgsJSON {
    return {
      name: this.name,
    }
  }

  static fromJSON(obj: CreateGroupArgsJSON): CreateGroupArgs {
    return new CreateGroupArgs({
      name: obj.name,
    })
  }

  toEncodable() {
    return CreateGroupArgs.toEncodable(this)
  }
}

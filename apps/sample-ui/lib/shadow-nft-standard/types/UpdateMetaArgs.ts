// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface UpdateMetaArgsFields {
  name: string | null
  uri: string | null
  mutable: boolean | null
}

export interface UpdateMetaArgsJSON {
  name: string | null
  uri: string | null
  mutable: boolean | null
}

/**
 * Only the following fields should be updatable:
 * 1) name
 * 3) uri
 * 5) mutable
 */
export class UpdateMetaArgs {
  readonly name: string | null
  readonly uri: string | null
  readonly mutable: boolean | null

  constructor(fields: UpdateMetaArgsFields) {
    this.name = fields.name
    this.uri = fields.uri
    this.mutable = fields.mutable
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.str(), "name"),
        borsh.option(borsh.str(), "uri"),
        borsh.option(borsh.bool(), "mutable"),
      ],
      property
    )
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new UpdateMetaArgs({
      name: obj.name,
      uri: obj.uri,
      mutable: obj.mutable,
    })
  }

  static toEncodable(fields: UpdateMetaArgsFields) {
    return {
      name: fields.name,
      uri: fields.uri,
      mutable: fields.mutable,
    }
  }

  toJSON(): UpdateMetaArgsJSON {
    return {
      name: this.name,
      uri: this.uri,
      mutable: this.mutable,
    }
  }

  static fromJSON(obj: UpdateMetaArgsJSON): UpdateMetaArgs {
    return new UpdateMetaArgs({
      name: obj.name,
      uri: obj.uri,
      mutable: obj.mutable,
    })
  }

  toEncodable() {
    return UpdateMetaArgs.toEncodable(this)
  }
}

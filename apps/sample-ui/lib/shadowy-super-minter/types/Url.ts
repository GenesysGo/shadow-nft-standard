// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface UrlFields {
  prefix: types.PrefixKind
  object: string
}

export interface UrlJSON {
  prefix: types.PrefixJSON
  object: string
}

export class Url {
  readonly prefix: types.PrefixKind
  readonly object: string

  constructor(fields: UrlFields) {
    this.prefix = fields.prefix
    this.object = fields.object
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.Prefix.layout("prefix"), borsh.str("object")],
      property
    )
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new Url({
      prefix: types.Prefix.fromDecoded(obj.prefix),
      object: obj.object,
    })
  }

  static toEncodable(fields: UrlFields) {
    return {
      prefix: fields.prefix.toEncodable(),
      object: fields.object,
    }
  }

  toJSON(): UrlJSON {
    return {
      prefix: this.prefix.toJSON(),
      object: this.object,
    }
  }

  static fromJSON(obj: UrlJSON): Url {
    return new Url({
      prefix: types.Prefix.fromJSON(obj.prefix),
      object: obj.object,
    })
  }

  toEncodable() {
    return Url.toEncodable(this)
  }
}

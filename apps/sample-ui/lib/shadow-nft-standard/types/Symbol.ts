// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface SymbolFields {
  inner: Array<number>
}

export interface SymbolJSON {
  inner: Array<number>
}

/**
 * Only valid ASCII is allowed
 *
 * (TODO: should we extend to all utf-8?)
 */
export class Symbol {
  readonly inner: Array<number>

  constructor(fields: SymbolFields) {
    this.inner = fields.inner
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 8, "inner")], property)
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new Symbol({
      inner: obj.inner,
    })
  }

  static toEncodable(fields: SymbolFields) {
    return {
      inner: fields.inner,
    }
  }

  toJSON(): SymbolJSON {
    return {
      inner: this.inner,
    }
  }

  static fromJSON(obj: SymbolJSON): Symbol {
    return new Symbol({
      inner: obj.inner,
    })
  }

  toEncodable() {
    return Symbol.toEncodable(this)
  }
}

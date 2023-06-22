// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import * as types from "../types"

export interface CreateMetaArgsFields {
  updateAuthority: PublicKey
  name: string
  uri: types.UrlFields
  mutable: boolean
  collectionKey: PublicKey
}

export interface CreateMetaArgsJSON {
  updateAuthority: string
  name: string
  uri: types.UrlJSON
  mutable: boolean
  collectionKey: string
}

export class CreateMetaArgs {
  readonly updateAuthority: PublicKey
  readonly name: string
  readonly uri: types.Url
  readonly mutable: boolean
  readonly collectionKey: PublicKey

  constructor(fields: CreateMetaArgsFields) {
    this.updateAuthority = fields.updateAuthority
    this.name = fields.name
    this.uri = new types.Url({ ...fields.uri })
    this.mutable = fields.mutable
    this.collectionKey = fields.collectionKey
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("updateAuthority"),
        borsh.str("name"),
        types.Url.layout("uri"),
        borsh.bool("mutable"),
        borsh.publicKey("collectionKey"),
      ],
      property
    )
  }

  // eslint-disable-next-line
  static fromDecoded(obj: any) {
    return new CreateMetaArgs({
      updateAuthority: obj.updateAuthority,
      name: obj.name,
      uri: types.Url.fromDecoded(obj.uri),
      mutable: obj.mutable,
      collectionKey: obj.collectionKey,
    })
  }

  static toEncodable(fields: CreateMetaArgsFields) {
    return {
      updateAuthority: fields.updateAuthority,
      name: fields.name,
      uri: types.Url.toEncodable(fields.uri),
      mutable: fields.mutable,
      collectionKey: fields.collectionKey,
    }
  }

  toJSON(): CreateMetaArgsJSON {
    return {
      updateAuthority: this.updateAuthority.toString(),
      name: this.name,
      uri: this.uri.toJSON(),
      mutable: this.mutable,
      collectionKey: this.collectionKey.toString(),
    }
  }

  static fromJSON(obj: CreateMetaArgsJSON): CreateMetaArgs {
    return new CreateMetaArgs({
      updateAuthority: new PublicKey(obj.updateAuthority),
      name: obj.name,
      uri: types.Url.fromJSON(obj.uri),
      mutable: obj.mutable,
      collectionKey: new PublicKey(obj.collectionKey),
    })
  }

  toEncodable() {
    return CreateMetaArgs.toEncodable(this)
  }
}

import * as borsh from "@coral-xyz/borsh";
import { Connection, PublicKey } from "@solana/web3.js";

import { PROGRAM_ID } from "../programId";
import * as types from "../types";

export interface MetadataFields {
  /** The spl-token-2022 mint address of the token associated with the NFT */
  mint: PublicKey;
  /** The pubkey of the upgrade authority of this metadata account */
  updateAuthority: PublicKey;
  /**
   * Pubkey of the collection that this asset belongs to.
   *
   * Contains information about royalties, creator group, collection size,
   * the collection symbol, and whether it's verified
   */
  collectionKey: PublicKey;
  /** Used to discriminate between primary and secondary sales */
  postPrimary: boolean;
  /** Marks metadata as mutable or immutable */
  mutable: boolean;
  /** The asset's name */
  name: string;
  /** Location of the off-chain metadata */
  uri: types.UrlFields;
}

export interface MetadataJSON {
  /** The spl-token-2022 mint address of the token associated with the NFT */
  mint: string;
  /** The pubkey of the upgrade authority of this metadata account */
  updateAuthority: string;
  /**
   * Pubkey of the collection that this asset belongs to.
   *
   * Contains information about royalties, creator group, collection size,
   * the collection symbol, and whether it's verified
   */
  collectionKey: string;
  /** Used to discriminate between primary and secondary sales */
  postPrimary: boolean;
  /** Marks metadata as mutable or immutable */
  mutable: boolean;
  /** The asset's name */
  name: string;
  /** Location of the off-chain metadata */
  uri: types.UrlJSON;
}

export class Metadata {
  /** The spl-token-2022 mint address of the token associated with the NFT */
  readonly mint: PublicKey;
  /** The pubkey of the upgrade authority of this metadata account */
  readonly updateAuthority: PublicKey;
  /**
   * Pubkey of the collection that this asset belongs to.
   *
   * Contains information about royalties, creator group, collection size,
   * the collection symbol, and whether it's verified
   */
  readonly collectionKey: PublicKey;
  /** Used to discriminate between primary and secondary sales */
  readonly postPrimary: boolean;
  /** Marks metadata as mutable or immutable */
  readonly mutable: boolean;
  /** The asset's name */
  readonly name: string;
  /** Location of the off-chain metadata */
  readonly uri: types.Url;

  static readonly discriminator = Buffer.from([
    72, 11, 121, 26, 111, 181, 85, 93,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey("mint"),
    borsh.publicKey("updateAuthority"),
    borsh.publicKey("collectionKey"),
    borsh.bool("postPrimary"),
    borsh.bool("mutable"),
    borsh.str("name"),
    types.Url.layout("uri"),
  ]);

  constructor(fields: MetadataFields) {
    this.mint = fields.mint;
    this.updateAuthority = fields.updateAuthority;
    this.collectionKey = fields.collectionKey;
    this.postPrimary = fields.postPrimary;
    this.mutable = fields.mutable;
    this.name = fields.name;
    this.uri = new types.Url({ ...fields.uri });
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Metadata | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<Metadata | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): Metadata {
    if (!data.slice(0, 8).equals(Metadata.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = Metadata.layout.decode(data.slice(8));

    return new Metadata({
      mint: dec.mint,
      updateAuthority: dec.updateAuthority,
      collectionKey: dec.collectionKey,
      postPrimary: dec.postPrimary,
      mutable: dec.mutable,
      name: dec.name,
      uri: types.Url.fromDecoded(dec.uri),
    });
  }

  toJSON(): MetadataJSON {
    return {
      mint: this.mint.toString(),
      updateAuthority: this.updateAuthority.toString(),
      collectionKey: this.collectionKey.toString(),
      postPrimary: this.postPrimary,
      mutable: this.mutable,
      name: this.name,
      uri: this.uri.toJSON(),
    };
  }

  static fromJSON(obj: MetadataJSON): Metadata {
    return new Metadata({
      mint: new PublicKey(obj.mint),
      updateAuthority: new PublicKey(obj.updateAuthority),
      collectionKey: new PublicKey(obj.collectionKey),
      postPrimary: obj.postPrimary,
      mutable: obj.mutable,
      name: obj.name,
      uri: types.Url.fromJSON(obj.uri),
    });
  }
}

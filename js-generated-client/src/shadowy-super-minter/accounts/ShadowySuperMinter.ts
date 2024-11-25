import * as borsh from "@coral-xyz/borsh";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";

import { MINTER_PROGRAM_ID } from "../minterProgramId";

export interface ShadowySuperMinterFields {
  creatorGroup: PublicKey;
  collection: PublicKey;
  itemsRedeemed: number;
  isMutable: boolean;
  itemsAvailable: number;
  price: BN;
  startTime: BN;
  endTime: BN;
}

export interface ShadowySuperMinterJSON {
  creatorGroup: string;
  collection: string;
  itemsRedeemed: number;
  isMutable: boolean;
  itemsAvailable: number;
  price: string;
  startTime: string;
  endTime: string;
}

export class ShadowySuperMinter {
  readonly creatorGroup: PublicKey;
  readonly collection: PublicKey;
  readonly itemsRedeemed: number;
  readonly isMutable: boolean;
  readonly itemsAvailable: number;
  readonly price: BN;
  readonly startTime: BN;
  readonly endTime: BN;

  static readonly discriminator = Buffer.from([
    212, 179, 152, 9, 221, 113, 36, 111,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey("creatorGroup"),
    borsh.publicKey("collection"),
    borsh.u32("itemsRedeemed"),
    borsh.bool("isMutable"),
    borsh.u32("itemsAvailable"),
    borsh.u64("price"),
    borsh.i64("startTime"),
    borsh.i64("endTime"),
  ]);

  constructor(fields: ShadowySuperMinterFields) {
    this.creatorGroup = fields.creatorGroup;
    this.collection = fields.collection;
    this.itemsRedeemed = fields.itemsRedeemed;
    this.isMutable = fields.isMutable;
    this.itemsAvailable = fields.itemsAvailable;
    this.price = fields.price;
    this.startTime = fields.startTime;
    this.endTime = fields.endTime;
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = MINTER_PROGRAM_ID
  ): Promise<ShadowySuperMinter | null> {
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
    programId: PublicKey = MINTER_PROGRAM_ID
  ): Promise<Array<ShadowySuperMinter | null>> {
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

  static decode(data: Buffer): ShadowySuperMinter {
    if (!data.slice(0, 8).equals(ShadowySuperMinter.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = ShadowySuperMinter.layout.decode(data.slice(8));

    return new ShadowySuperMinter({
      creatorGroup: dec.creatorGroup,
      collection: dec.collection,
      itemsRedeemed: dec.itemsRedeemed,
      isMutable: dec.isMutable,
      itemsAvailable: dec.itemsAvailable,
      price: dec.price,
      startTime: dec.startTime,
      endTime: dec.endTime,
    });
  }

  toJSON(): ShadowySuperMinterJSON {
    return {
      creatorGroup: this.creatorGroup.toString(),
      collection: this.collection.toString(),
      itemsRedeemed: this.itemsRedeemed,
      isMutable: this.isMutable,
      itemsAvailable: this.itemsAvailable,
      price: this.price.toString(),
      startTime: this.startTime.toString(),
      endTime: this.endTime.toString(),
    };
  }

  static fromJSON(obj: ShadowySuperMinterJSON): ShadowySuperMinter {
    return new ShadowySuperMinter({
      creatorGroup: new PublicKey(obj.creatorGroup),
      collection: new PublicKey(obj.collection),
      itemsRedeemed: obj.itemsRedeemed,
      isMutable: obj.isMutable,
      itemsAvailable: obj.itemsAvailable,
      price: new BN(obj.price),
      startTime: new BN(obj.startTime),
      endTime: new BN(obj.endTime),
    });
  }
}

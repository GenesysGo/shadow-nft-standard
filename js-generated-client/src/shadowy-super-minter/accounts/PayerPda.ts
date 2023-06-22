import * as borsh from "@coral-xyz/borsh";
import { Connection, PublicKey } from "@solana/web3.js";

import { MINTER_PROGRAM_ID } from "../minterProgramId";

export interface PayerPdaFields {}

export interface PayerPdaJSON {}

/**
 * An ephemeral account to be used to authorize a user to mint an NFT.
 * The standard program checks that the signer is this account.
 */
export class PayerPda {
  static readonly discriminator = Buffer.from([
    60, 58, 172, 79, 215, 168, 8, 189,
  ]);

  static readonly layout = borsh.struct([]);

  constructor(fields: PayerPdaFields) {}

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = MINTER_PROGRAM_ID
  ): Promise<PayerPda | null> {
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
  ): Promise<Array<PayerPda | null>> {
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

  static decode(data: Buffer): PayerPda {
    if (!data.slice(0, 8).equals(PayerPda.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    // @ts-ignore
    const dec = PayerPda.layout.decode(data.slice(8));

    return new PayerPda({});
  }

  toJSON(): PayerPdaJSON {
    return {};
  }

  static fromJSON(obj: PayerPdaJSON): PayerPda {
    return new PayerPda({});
  }
}

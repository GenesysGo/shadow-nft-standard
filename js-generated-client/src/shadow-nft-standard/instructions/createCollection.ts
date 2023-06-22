import * as borsh from "@coral-xyz/borsh";
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import { PROGRAM_ID } from "../programId";
import * as types from "../types";

export interface CreateCollectionArgs {
  args: types.CreateCollectionArgsFields;
}

export interface CreateCollectionAccounts {
  /** The collection account to be initialized */
  collection: PublicKey;
  /** The creator group */
  creatorGroup: PublicKey;
  /** A creator within the creator group which is paying to initalize the collection */
  payerCreator: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.CreateCollectionArgs.layout("args")]);

export function createCollection(
  args: CreateCollectionArgs,
  accounts: CreateCollectionAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.collection, isSigner: false, isWritable: true },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.payerCreator, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([156, 251, 92, 54, 233, 2, 16, 82]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      args: types.CreateCollectionArgs.toEncodable(args.args),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}

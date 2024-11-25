import * as borsh from "@coral-xyz/borsh";
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import { PROGRAM_ID } from "../programId";
import * as types from "../types";

export interface UpdateMetadataArgs {
  args: types.UpdateMetaArgsFields;
}

export interface UpdateMetadataAccounts {
  /**
   * The metadata account in question. Since it is already initialized,
   * the asset_mint must be valid since it was checked upon initialization.
   */
  metadata: PublicKey;
  /** The mint of the nft in question. Checked upon initialization */
  assetMint: PublicKey;
  updateAuthority: PublicKey;
  /** The creator of the NFT and collection */
  creatorGroup: PublicKey;
  /** The collection that the NFT belongs to */
  collection: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.UpdateMetaArgs.layout("args")]);

/** Instruction to update a metadata account. Requires an existing metadata account. */
export function updateMetadata(
  args: UpdateMetadataArgs,
  accounts: UpdateMetadataAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.assetMint, isSigner: false, isWritable: false },
    { pubkey: accounts.updateAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.collection, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([170, 182, 43, 239, 97, 78, 225, 186]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      args: types.UpdateMetaArgs.toEncodable(args.args),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}

import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import { PROGRAM_ID } from "../programId";

export interface BurnAccounts {
  /** Metadata account to burn */
  metadata: PublicKey;
  /** NFT Token Mint */
  assetMint: PublicKey;
  /** Owner's Token Account */
  ownerAta: PublicKey;
  /** Owner of the NFT */
  owner: PublicKey;
  /** Token program */
  tokenProgram: PublicKey;
  /** System program */
  systemProgram: PublicKey;
}

/** Instruction to burn a metadata account and associated NFT. */
export function burn(
  accounts: BurnAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.assetMint, isSigner: false, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([116, 110, 29, 56, 107, 219, 42, 93]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}

import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import { MINTER_PROGRAM_ID } from "../minterProgramId";

export interface MintAccounts {
  /**
   * An initialized minter account.
   *
   * In linear memory looks like
   * [[DISCRIMINANT][SHADOWY SUPER MINTER][MINT TYPE e.g. UNIFORM MINT][ZEROCOPY BITSLICE]]
   */
  shadowySuperMinter: PublicKey;
  /** The account which is minting an NFT. */
  minter: PublicKey;
  payerPda: PublicKey;
  /** The minter's associated token account for this NFT. */
  minterAta: PublicKey;
  /** The mint account to be initialized (if needed) during this instruction */
  mint: PublicKey;
  /** The account to be initialized by the standard program */
  metadata: PublicKey;
  /** The creator group associated with this collection and NFT. */
  creatorGroup: PublicKey;
  /** The collection associated with this NFT. */
  collection: PublicKey;
  /** The standard program */
  shadowNftStandard: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
  recentSlothashes: PublicKey;
}

export function mint(
  accounts: MintAccounts,
  programId: PublicKey = MINTER_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.shadowySuperMinter, isSigner: false, isWritable: true },
    { pubkey: accounts.minter, isSigner: true, isWritable: true },
    { pubkey: accounts.payerPda, isSigner: false, isWritable: true },
    { pubkey: accounts.minterAta, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: true, isWritable: true },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.collection, isSigner: false, isWritable: true },
    { pubkey: accounts.shadowNftStandard, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.recentSlothashes, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([51, 57, 225, 47, 182, 146, 137, 166]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}

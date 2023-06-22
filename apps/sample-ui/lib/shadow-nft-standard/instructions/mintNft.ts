// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface MintNftArgs {
  costLamports: BN
}

export interface MintNftAccounts {
  metadata: PublicKey
  minter: PublicKey
  minterAta: PublicKey
  assetMint: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("costLamports")])

/** Instruction to mint an NFT. Requires an existing metadata account. */
export function mintNft(
  args: MintNftArgs,
  accounts: MintNftAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.minter, isSigner: true, isWritable: true },
    { pubkey: accounts.minterAta, isSigner: false, isWritable: true },
    { pubkey: accounts.assetMint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([211, 57, 6, 167, 15, 219, 35, 251])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      costLamports: args.costLamports,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}

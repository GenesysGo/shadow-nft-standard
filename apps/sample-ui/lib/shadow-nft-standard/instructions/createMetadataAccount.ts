// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface CreateMetadataAccountArgs {
  args: types.CreateMetaArgsFields
}

export interface CreateMetadataAccountAccounts {
  /** The metadata account to be initialized. */
  metadata: PublicKey
  /**
   * NOTE: If this mutability changes + if creator group code changes,
   * we must revisit group seed
   */
  creatorGroup: PublicKey
  /** The token program mint account of the NFT */
  assetMint: PublicKey
  /** The `Collection` account associated with this NFT */
  collection: PublicKey
  /** Either a creator or an ephemeral payer pda from the minter program. */
  payerCreator: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.CreateMetaArgs.layout("args")])

/** Instruction to create a metadata account. A `CreatorGroup` and `Collection` must be initialized. */
export function createMetadataAccount(
  args: CreateMetadataAccountArgs,
  accounts: CreateMetadataAccountAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.assetMint, isSigner: false, isWritable: false },
    { pubkey: accounts.collection, isSigner: false, isWritable: true },
    { pubkey: accounts.payerCreator, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([75, 73, 45, 178, 212, 194, 127, 113])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      args: types.CreateMetaArgs.toEncodable(args.args),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}

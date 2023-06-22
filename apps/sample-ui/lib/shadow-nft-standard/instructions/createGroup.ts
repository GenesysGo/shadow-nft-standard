// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface CreateGroupArgs {
  args: types.CreateGroupArgsFields
}

export interface CreateGroupAccounts {
  /** The creator group account to be initialized */
  creatorGroup: PublicKey
  creator: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.CreateGroupArgs.layout("args")])

export function createGroup(
  args: CreateGroupArgs,
  accounts: CreateGroupAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([79, 60, 158, 134, 61, 199, 56, 248])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      args: types.CreateGroupArgs.toEncodable(args.args),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}

// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface InitializeArgs {
  args: types.InitializeArgsFields
}

export interface InitializeAccounts {
  /**
   * Due to the 10KB size limit of system program cpi allocations, this account must be initialized in a
   * previous instruction. The macro will check that our program is the owner of this account, and that
   * there is enough space to hold the data we will write in this instruction and in `add_assets`.
   *
   * Note that although our program owns this account, it is not a program derived address (PDA). It must
   * be initialized via `CreateAccountWithSeed`. Using the creator group and the first 32 bytes of the `Pubkey`
   * string makes this `Pubkey` unique. The string is used, and not the byte array, because the `seed` argument
   * needs to be a `&str`; Rust requires `&str` be valid utf-8, which we cannot guarantee with any random byte
   * sequence that makes up a `Pubkey`.
   *
   * All in all, the account structure in linear memory to be initialized looks like
   * [[DISCRIMINANT][SHADOWY SUPER MINTER][MINT TYPE e.g. UNIFORM MINT][ZEROCOPY BITSLICE (if needed)]]
   */
  shadowySuperMinter: PublicKey
  /**
   * The `Collection` account which is already initialized, or to be initialized.
   *
   */
  collection: PublicKey
  /**
   * The `CreatorGroup` account which is already initialized, or to be initialized.
   *
   */
  creatorGroup: PublicKey
  payerCreator: PublicKey
  shadowNftStandardProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.InitializeArgs.layout("args")])

export function initialize(
  args: InitializeArgs,
  accounts: InitializeAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.shadowySuperMinter, isSigner: false, isWritable: true },
    { pubkey: accounts.collection, isSigner: false, isWritable: true },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.payerCreator, isSigner: true, isWritable: true },
    {
      pubkey: accounts.shadowNftStandardProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      args: types.InitializeArgs.toEncodable(args.args),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}

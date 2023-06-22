// eslint-disable-line
import * as borsh from "@coral-xyz/borsh"
import { AccountMeta, PublicKey, TransactionInstruction } from "@solana/web3.js"
// eslint-disable-line
import BN from "bn.js"

// eslint-disable-line
import { PROGRAM_ID } from "../programId"
// eslint-disable-line
import * as types from "../types"

export interface AddAssetsArgs {
  index: number
  assets: Array<types.AssetFields>
}

export interface AddAssetsAccounts {
  shadowySuperMinter: PublicKey
  authority: PublicKey
  creatorGroup: PublicKey
}

export const layout = borsh.struct([
  borsh.u32("index"),
  borsh.vec(types.Asset.layout(), "assets"),
])

export function addAssets(
  args: AddAssetsArgs,
  accounts: AddAssetsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.shadowySuperMinter, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([221, 232, 106, 164, 156, 75, 127, 106])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      index: args.index,
      assets: args.assets.map((item) => types.Asset.toEncodable(item)),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}

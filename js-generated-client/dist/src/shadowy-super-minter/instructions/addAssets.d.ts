import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface AddAssetsArgs {
    index: number;
    assets: Array<types.AssetFields>;
}
export interface AddAssetsAccounts {
    shadowySuperMinter: PublicKey;
    authority: PublicKey;
    creatorGroup: PublicKey;
}
export declare const layout: any;
export declare function addAssets(args: AddAssetsArgs, accounts: AddAssetsAccounts, programId?: PublicKey): TransactionInstruction;

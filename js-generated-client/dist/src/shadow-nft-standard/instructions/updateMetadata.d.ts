import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface UpdateMetadataArgs {
    args: types.UpdateMetaArgsFields;
}
export interface UpdateMetadataAccounts {
    metadata: PublicKey;
    assetMint: PublicKey;
    updateAuthority: PublicKey;
    creatorGroup: PublicKey;
    collection: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function updateMetadata(args: UpdateMetadataArgs, accounts: UpdateMetadataAccounts, programId?: PublicKey): TransactionInstruction;

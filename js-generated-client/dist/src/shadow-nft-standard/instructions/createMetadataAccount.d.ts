import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface CreateMetadataAccountArgs {
    args: types.CreateMetaArgsFields;
}
export interface CreateMetadataAccountAccounts {
    metadata: PublicKey;
    creatorGroup: PublicKey;
    assetMint: PublicKey;
    collection: PublicKey;
    payerCreator: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function createMetadataAccount(args: CreateMetadataAccountArgs, accounts: CreateMetadataAccountAccounts, programId?: PublicKey): TransactionInstruction;

import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface CreateCollectionArgs {
    args: types.CreateCollectionArgsFields;
}
export interface CreateCollectionAccounts {
    collection: PublicKey;
    creatorGroup: PublicKey;
    payerCreator: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function createCollection(args: CreateCollectionArgs, accounts: CreateCollectionAccounts, programId?: PublicKey): TransactionInstruction;

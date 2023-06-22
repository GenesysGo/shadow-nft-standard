import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface CreateGroupArgs {
    args: types.CreateGroupArgsFields;
}
export interface CreateGroupAccounts {
    creatorGroup: PublicKey;
    creator: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function createGroup(args: CreateGroupArgs, accounts: CreateGroupAccounts, programId?: PublicKey): TransactionInstruction;

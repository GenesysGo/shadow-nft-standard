import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as types from "../types";
export interface InitializeArgs {
    args: types.InitializeArgsFields;
}
export interface InitializeAccounts {
    shadowySuperMinter: PublicKey;
    collection: PublicKey;
    creatorGroup: PublicKey;
    payerCreator: PublicKey;
    shadowNftStandardProgram: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function initialize(args: InitializeArgs, accounts: InitializeAccounts, programId?: PublicKey): TransactionInstruction;

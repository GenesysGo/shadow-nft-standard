import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
export interface MintNftArgs {
    costLamports: BN;
}
export interface MintNftAccounts {
    metadata: PublicKey;
    minter: PublicKey;
    minterAta: PublicKey;
    assetMint: PublicKey;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    systemProgram: PublicKey;
}
export declare const layout: any;
export declare function mintNft(args: MintNftArgs, accounts: MintNftAccounts, programId?: PublicKey): TransactionInstruction;

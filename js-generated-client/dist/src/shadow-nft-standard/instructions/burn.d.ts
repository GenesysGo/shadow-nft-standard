import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export interface BurnAccounts {
    metadata: PublicKey;
    assetMint: PublicKey;
    ownerAta: PublicKey;
    owner: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
}
export declare function burn(accounts: BurnAccounts, programId?: PublicKey): TransactionInstruction;

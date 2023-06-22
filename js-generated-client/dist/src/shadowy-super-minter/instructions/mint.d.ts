import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export interface MintAccounts {
    shadowySuperMinter: PublicKey;
    minter: PublicKey;
    payerPda: PublicKey;
    minterAta: PublicKey;
    mint: PublicKey;
    metadata: PublicKey;
    creatorGroup: PublicKey;
    collection: PublicKey;
    shadowNftStandard: PublicKey;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    systemProgram: PublicKey;
    recentSlothashes: PublicKey;
}
export declare function mint(accounts: MintAccounts, programId?: PublicKey): TransactionInstruction;

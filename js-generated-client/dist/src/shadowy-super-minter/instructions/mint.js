"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mint = void 0;
const web3_js_1 = require("@solana/web3.js");
const minterProgramId_1 = require("../minterProgramId");
function mint(accounts, programId = minterProgramId_1.MINTER_PROGRAM_ID) {
    const keys = [
        { pubkey: accounts.shadowySuperMinter, isSigner: false, isWritable: true },
        { pubkey: accounts.minter, isSigner: true, isWritable: true },
        { pubkey: accounts.payerPda, isSigner: false, isWritable: true },
        { pubkey: accounts.minterAta, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: true, isWritable: true },
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.creatorGroup, isSigner: false, isWritable: false },
        { pubkey: accounts.collection, isSigner: false, isWritable: true },
        { pubkey: accounts.shadowNftStandard, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        {
            pubkey: accounts.associatedTokenProgram,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.recentSlothashes, isSigner: false, isWritable: false },
    ];
    const identifier = Buffer.from([51, 57, 225, 47, 182, 146, 137, 166]);
    const data = identifier;
    const ix = new web3_js_1.TransactionInstruction({ keys, programId, data });
    return ix;
}
exports.mint = mint;
//# sourceMappingURL=mint.js.map
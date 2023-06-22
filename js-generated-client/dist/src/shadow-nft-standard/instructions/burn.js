"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burn = void 0;
const web3_js_1 = require("@solana/web3.js");
const programId_1 = require("../programId");
function burn(accounts, programId = programId_1.PROGRAM_ID) {
    const keys = [
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.assetMint, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const identifier = Buffer.from([116, 110, 29, 56, 107, 219, 42, 93]);
    const data = identifier;
    const ix = new web3_js_1.TransactionInstruction({ keys, programId, data });
    return ix;
}
exports.burn = burn;
//# sourceMappingURL=burn.js.map
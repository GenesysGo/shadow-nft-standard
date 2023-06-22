"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.layout = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const minterProgramId_1 = require("../minterProgramId");
const types = __importStar(require("../types"));
exports.layout = borsh.struct([types.InitializeArgs.layout("args")]);
function initialize(args, accounts, programId = minterProgramId_1.MINTER_PROGRAM_ID) {
    const keys = [
        { pubkey: accounts.shadowySuperMinter, isSigner: false, isWritable: true },
        { pubkey: accounts.collection, isSigner: false, isWritable: true },
        { pubkey: accounts.creatorGroup, isSigner: false, isWritable: true },
        { pubkey: accounts.payerCreator, isSigner: true, isWritable: true },
        {
            pubkey: accounts.shadowNftStandardProgram,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const identifier = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
    const buffer = Buffer.alloc(1000);
    const len = exports.layout.encode({
        args: types.InitializeArgs.toEncodable(args.args),
    }, buffer);
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
    const ix = new web3_js_1.TransactionInstruction({ keys, programId, data });
    return ix;
}
exports.initialize = initialize;
//# sourceMappingURL=initialize.js.map
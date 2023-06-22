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
exports.PayerPda = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const minterProgramId_1 = require("../minterProgramId");
class PayerPda {
    constructor(fields) { }
    static async fetch(c, address, programId = minterProgramId_1.MINTER_PROGRAM_ID) {
        const info = await c.getAccountInfo(address);
        if (info === null) {
            return null;
        }
        if (!info.owner.equals(programId)) {
            throw new Error("account doesn't belong to this program");
        }
        return this.decode(info.data);
    }
    static async fetchMultiple(c, addresses, programId = minterProgramId_1.MINTER_PROGRAM_ID) {
        const infos = await c.getMultipleAccountsInfo(addresses);
        return infos.map((info) => {
            if (info === null) {
                return null;
            }
            if (!info.owner.equals(programId)) {
                throw new Error("account doesn't belong to this program");
            }
            return this.decode(info.data);
        });
    }
    static decode(data) {
        if (!data.slice(0, 8).equals(PayerPda.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        const dec = PayerPda.layout.decode(data.slice(8));
        return new PayerPda({});
    }
    toJSON() {
        return {};
    }
    static fromJSON(obj) {
        return new PayerPda({});
    }
}
exports.PayerPda = PayerPda;
PayerPda.discriminator = Buffer.from([
    60, 58, 172, 79, 215, 168, 8, 189,
]);
PayerPda.layout = borsh.struct([]);
//# sourceMappingURL=PayerPda.js.map
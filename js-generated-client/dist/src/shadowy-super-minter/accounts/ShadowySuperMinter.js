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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowySuperMinter = void 0;
const borsh = __importStar(require("@coral-xyz/borsh"));
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const minterProgramId_1 = require("../minterProgramId");
class ShadowySuperMinter {
    constructor(fields) {
        this.creatorGroup = fields.creatorGroup;
        this.collection = fields.collection;
        this.itemsRedeemed = fields.itemsRedeemed;
        this.isMutable = fields.isMutable;
        this.itemsAvailable = fields.itemsAvailable;
        this.price = fields.price;
        this.startTime = fields.startTime;
        this.endTime = fields.endTime;
    }
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
        if (!data.slice(0, 8).equals(ShadowySuperMinter.discriminator)) {
            throw new Error("invalid account discriminator");
        }
        const dec = ShadowySuperMinter.layout.decode(data.slice(8));
        return new ShadowySuperMinter({
            creatorGroup: dec.creatorGroup,
            collection: dec.collection,
            itemsRedeemed: dec.itemsRedeemed,
            isMutable: dec.isMutable,
            itemsAvailable: dec.itemsAvailable,
            price: dec.price,
            startTime: dec.startTime,
            endTime: dec.endTime,
        });
    }
    toJSON() {
        return {
            creatorGroup: this.creatorGroup.toString(),
            collection: this.collection.toString(),
            itemsRedeemed: this.itemsRedeemed,
            isMutable: this.isMutable,
            itemsAvailable: this.itemsAvailable,
            price: this.price.toString(),
            startTime: this.startTime.toString(),
            endTime: this.endTime.toString(),
        };
    }
    static fromJSON(obj) {
        return new ShadowySuperMinter({
            creatorGroup: new web3_js_1.PublicKey(obj.creatorGroup),
            collection: new web3_js_1.PublicKey(obj.collection),
            itemsRedeemed: obj.itemsRedeemed,
            isMutable: obj.isMutable,
            itemsAvailable: obj.itemsAvailable,
            price: new bn_js_1.default(obj.price),
            startTime: new bn_js_1.default(obj.startTime),
            endTime: new bn_js_1.default(obj.endTime),
        });
    }
}
exports.ShadowySuperMinter = ShadowySuperMinter;
ShadowySuperMinter.discriminator = Buffer.from([
    212, 179, 152, 9, 221, 113, 36, 111,
]);
ShadowySuperMinter.layout = borsh.struct([
    borsh.publicKey("creatorGroup"),
    borsh.publicKey("collection"),
    borsh.u32("itemsRedeemed"),
    borsh.bool("isMutable"),
    borsh.u32("itemsAvailable"),
    borsh.u64("price"),
    borsh.i64("startTime"),
    borsh.i64("endTime"),
]);
//# sourceMappingURL=ShadowySuperMinter.js.map